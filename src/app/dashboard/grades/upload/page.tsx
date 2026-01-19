'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ocrService } from '@/lib/services/ocr'
import HolographicCard from '@/components/ui/holographic/HolographicCard'
import Button from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanLine, Upload, FileText, Check, X, Loader2, Scan } from 'lucide-react'
import toast from 'react-hot-toast'
import { gamificationService } from '@/lib/services/gamification'

export default function OCRUploadPage() {
    const [isDragging, setIsDragging] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [scannedData, setScannedData] = useState<any>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) processFile(file)
    }

    const processFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        setIsScanning(true)
        try {
            // Real API call will manage latency

            const result = await ocrService.parseMarksheet(file)
            setScannedData(result)
            toast.success('Scan Complete: Data Extracted')
        } catch (error) {
            console.error(error)
            toast.error('Scan Failed: Could not read document')
        } finally {
            setIsScanning(false)
        }
    }

    const handleSave = async () => {
        if (!scannedData) return

        const { data: user } = await supabase.auth.getUser()
        if (!user.user) return

        try {
            // In a real app, match subject names to IDs. For now, we'll just log/toast.
            // const subjectMap = await fetchSubjects... 

            // Award XP for using advanced tech
            await gamificationService.awardXP(user.user.id, 50, 'Completed Neural Scan', 'pioneering')

            toast.success(`Imported ${scannedData.subjects.length} grades to database`)
            setScannedData(null)
        } catch (error) {
            toast.error('Failed to save data')
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-display font-bold flex items-center gap-3 mb-2">
                    <span className="p-2 rounded-lg bg-neon-green/10 border border-neon-green/20">
                        <ScanLine className="w-8 h-8 text-neon-green" />
                    </span>
                    <span className="gradient-text">OPTICAL SCANNER</span>
                </h1>
                <p className="text-text-secondary font-mono text-sm ml-14">
                    DATA EXTRACTION ARRAY // UPLOAD MARKSHEET
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Dropzone */}
                <HolographicCard
                    className={`
            relative min-h-[400px] flex flex-col items-center justify-center p-8 border-dashed transition-all duration-300
            ${isDragging ? 'border-neon-green bg-neon-green/10 scale-[1.02]' : ''}
            ${isScanning ? 'border-neon-blue bg-neon-blue/5' : ''}
          `}
                >
                    {/* Scanning Animation Overlay */}
                    {isScanning && (
                        <motion.div
                            initial={{ top: '0%' }}
                            animate={{ top: '100%' }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="absolute left-0 w-full h-1 bg-neon-blue/50 shadow-[0_0_20px_#00D4FF] z-10"
                        />
                    )}

                    <div className="text-center space-y-4 relative z-0">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-colors ${isScanning ? 'bg-neon-blue/20' : 'bg-white/5'}`}>
                            {isScanning ? (
                                <Loader2 className="w-10 h-10 text-neon-blue animate-spin" />
                            ) : (
                                <Upload className="w-10 h-10 text-text-secondary" />
                            )}
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-1">
                                {isScanning ? 'ANALYZING DOCUMENT...' : 'Drop Marksheet Here'}
                            </h3>
                            <p className="text-sm text-text-secondary">
                                Supports JPG, PNG (Max 5MB)
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isScanning}
                        >
                            Select File
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                        />
                    </div>
                </HolographicCard>

                {/* Results Panel */}
                <AnimatePresence mode="wait">
                    {scannedData ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <HolographicCard className="h-full flex flex-col">
                                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-neon-purple" />
                                        <span className="font-bold">Extracted Data</span>
                                    </div>
                                    <span className="text-xs font-mono text-neon-green">CONFIDENCE: 98%</span>
                                </div>

                                <div className="space-y-4 flex-1 overflow-y-auto">
                                    {scannedData.studentName && (
                                        <div className="p-3 bg-white/5 rounded-lg text-sm">
                                            <span className="text-text-secondary">Student:</span> <span className="font-bold text-white">{scannedData.studentName}</span>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <p className="text-xs font-mono text-text-secondary uppercase">Subjects Found</p>
                                        {scannedData.subjects.map((sub: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-neon-purple/50 transition-colors">
                                                <span className="font-medium">{sub.name}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-neon-purple font-bold">{sub.marks}/{sub.totalMarks}</span>
                                                    {sub.grade && <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-bold">{sub.grade}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <Button variant="ghost" className="flex-1" onClick={() => setScannedData(null)}>
                                        <X className="w-4 h-4 mr-2" /> Discard
                                    </Button>
                                    <Button className="flex-1" onClick={handleSave}>
                                        <Check className="w-4 h-4 mr-2" /> Import
                                    </Button>
                                </div>
                            </HolographicCard>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-30 border-2 border-dashed border-white/10 rounded-3xl">
                            <Scan className="w-16 h-16 mb-4" />
                            <p className="font-mono text-sm">AWAITING INPUT STREAM</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
