import Tesseract from 'tesseract.js'
import { createClient } from '@/lib/supabase/client'

// OCR Service for marksheet scanning and document processing
export class OCRService {
  private supabase = createClient()

  /**
   * Upload file to Supabase Storage and get Public URL
   */
  private async uploadImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      const filePath = `ocr-scans/${fileName}`

      const { error: uploadError } = await this.supabase.storage
        .from('documents') // Assuming 'documents' bucket exists
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = this.supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Upload Error:', error)
      return null
    }
  }

  /**
   * Scan document using DeepSeek-OCR (Serverless GPU)
   */
  async scanWithDeepSeek(imageUrl: string): Promise<string> {
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      })

      if (!response.ok) {
        throw new Error('DeepSeek Scan Failed')
      }

      const data = await response.json()
      return data.markdown
    } catch (error) {
      console.error('DeepSeek API Error:', error)
      throw error
    }
  }

  /**
   * Extract text from image using Tesseract.js (Fallback)
   */
  async extractTextFromImage(imageFile: File): Promise<{
    text: string
    confidence: number
  }> {
    try {
      const result = await Tesseract.recognize(imageFile, 'eng', {
        logger: (m) => console.log(m),
      })

      return {
        text: result.data.text,
        confidence: result.data.confidence,
      }
    } catch (error) {
      console.error('OCR Error:', error)
      throw new Error('Failed to extract text from image')
    }
  }

  /**
   * Parse marksheet from scanned image
   * Uses DeepSeek-OCR if available, falls back to Tesseract
   */
  async parseMarksheet(imageFile: File): Promise<{
    subjects: Array<{
      name: string
      marks: number
      totalMarks: number
      grade?: string
    }>
    semester?: number
    studentName?: string
    rollNumber?: string
  }> {
    // 1. Try DeepSeek-OCR (The "Elite" Way)
    try {
      const imageUrl = await this.uploadImage(imageFile)
      if (imageUrl) {
        const markdown = await this.scanWithDeepSeek(imageUrl)
        // TODO: Implement a robust Markdown -> JSON parser
        // For now, we return a mock structure if markdown is present, or parse it conceptually
        // In a real implementation, you'd use an LLM or Regex to parse the Markdown table
        console.log("DeepSeek Markdown:", markdown)

        // Temporary: Parse the markdown somewhat to extract data or fall through
        // For this task, we will just log it and fallback to the regex logic on the Client side maybe?
        // Actually, the user architecture says: "Your app parses that Markdown into JSON"
        // Let's implement a basic Markdown Table parser here

        return this.parseMarkdownGrades(markdown)
      }
    } catch (error) {
      console.warn('DeepSeek-OCR failed, falling back to Tesseract', error)
    }

    // 2. Fallback to Tesseract
    const { text } = await this.extractTextFromImage(imageFile)

    // Parse text to extract grades
    const subjects = this.extractGradesFromText(text)

    return {
      subjects,
      semester: this.extractSemester(text),
      studentName: this.extractStudentName(text),
      rollNumber: this.extractRollNumber(text),
    }
  }

  private parseMarkdownGrades(markdown: string) {
    // Simple parser for Markdown tables
    // | Subject | Marks | Total |
    // | Math    | 90    | 100   |
    const lines = markdown.split('\n')
    const subjects = []

    for (const line of lines) {
      if (line.includes('|')) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p)
        // Heuristic: If it has numbers, it might be a grade row
        if (parts.length >= 3) {
          const name = parts[0]
          const marks = parseInt(parts[1])
          const total = parseInt(parts[2])
          if (!isNaN(marks) && !isNaN(total)) {
            subjects.push({ name, marks, totalMarks: total })
          }
        }
      }
    }

    return {
      subjects,
      // Extract other metadata from markdown text if possible
    }
  }

  /**
   * Parse timetable from image
   */
  async parseTimetable(imageFile: File): Promise<{
    subjects: Array<{
      name: string
      code?: string
      schedule: {
        day: string
        time: string
        room?: string
      }[]
    }>
  }> {
    const { text } = await this.extractTextFromImage(imageFile)

    // Extract subject names and timings
    const subjects = this.extractSubjectsFromTimetable(text)

    return { subjects }
  }

  /**
   * Extract grades from text using regex patterns
   */
  private extractGradesFromText(text: string): Array<{
    name: string
    marks: number
    totalMarks: number
    grade?: string
  }> {
    const subjects: any[] = []

    // Common patterns for grades
    // Example: "Mathematics 85/100 A"
    const gradePattern = /([A-Za-z\s]+)\s+(\d+)\/(\d+)\s*([A-F][+-]?)?/g
    let match

    while ((match = gradePattern.exec(text)) !== null) {
      subjects.push({
        name: match[1].trim(),
        marks: parseInt(match[2]),
        totalMarks: parseInt(match[3]),
        grade: match[4] || undefined,
      })
    }

    return subjects
  }

  /**
   * Extract semester from text
   */
  private extractSemester(text: string): number | undefined {
    const semPattern = /semester[:\s]*(\d+)|sem[:\s]*(\d+)/i
    const match = text.match(semPattern)
    return match ? parseInt(match[1] || match[2]) : undefined
  }

  /**
   * Extract student name from text
   */
  private extractStudentName(text: string): string | undefined {
    const namePattern = /name[:\s]*([A-Za-z\s]+)/i
    const match = text.match(namePattern)
    return match ? match[1].trim() : undefined
  }

  /**
   * Extract roll number from text
   */
  private extractRollNumber(text: string): string | undefined {
    const rollPattern = /roll\s*(?:no|number)[:\s]*([A-Z0-9]+)/i
    const match = text.match(rollPattern)
    return match ? match[1].trim() : undefined
  }

  /**
   * Extract subjects from timetable text
   */
  private extractSubjectsFromTimetable(text: string): Array<{
    name: string
    code?: string
    schedule: any[]
  }> {
    // This is a simplified version
    // In production, you'd use more sophisticated parsing
    const subjects: any[] = []

    const lines = text.split('\n')
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

    lines.forEach(line => {
      // Look for subject names followed by times
      const timePattern = /(\d{1,2}):(\d{2})/g
      if (timePattern.test(line)) {
        // Extract subject name (usually at start of line)
        const subjectName = line.split(/\s+/)[0]
        if (subjectName.length > 3) {
          subjects.push({
            name: subjectName,
            schedule: [],
          })
        }
      }
    })

    return subjects
  }

  /**
   * Extract ID card information
   */
  async parseIDCard(imageFile: File): Promise<{
    name?: string
    rollNumber?: string
    department?: string
    validUntil?: string
  }> {
    const { text } = await this.extractTextFromImage(imageFile)

    return {
      name: this.extractStudentName(text),
      rollNumber: this.extractRollNumber(text),
      department: this.extractDepartment(text),
      validUntil: this.extractValidUntil(text),
    }
  }

  private extractDepartment(text: string): string | undefined {
    const deptPattern = /department[:\s]*([A-Za-z\s]+)/i
    const match = text.match(deptPattern)
    return match ? match[1].trim() : undefined
  }

  private extractValidUntil(text: string): string | undefined {
    const datePattern = /valid\s*(?:until|till)[:\s]*(\d{2}\/\d{2}\/\d{4})/i
    const match = text.match(datePattern)
    return match ? match[1] : undefined
  }
}

export const ocrService = new OCRService()
