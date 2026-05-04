'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'id' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const dictionaries = {
  en: {
    title: 'Job Matcher',
    jargon: 'Match your Dreamjob',
    aiTools: 'AI Tools',
    tracker: 'Application Tracker',
    stats: 'Statistics',
    jobLinkPlaceholder: 'Paste the job URL or full job description here...',
    uploadResume: 'Upload Resume (PDF)',
    tailorResume: 'Tailor My Resume',
    jobSummary: 'Job Summary',
    coverLetter: 'Cover Letter Writer',
    resumeCoach: 'Resume Coach',
    jobFit: 'Job Fit Analyzer',
    addJob: '+ Add Job',
    searchPlaceholder: 'Search jobs...',
    filterAll: 'All Statuses',
    statusNotApplied: 'Belum Apply',
    statusApplied: 'Sudah Apply',
    statusRejected: 'Reject',
    statusNoReply: 'No Reply',
    statusAccepted: 'Diterima',
    statusInterview: 'Menunggu Interview',
    companyName: 'Company Name',
    position: 'Position',
    jobUrl: 'Job URL',
    notes: 'Notes',
    save: 'Save',
    cancel: 'Cancel',
    processing: 'Processing...',
    error: 'An error occurred',
  },
  id: {
    title: 'Job Matcher',
    jargon: 'Match your Dreamjob',
    aiTools: 'Alat AI',
    tracker: 'Pelacak Lamaran',
    stats: 'Statistik',
    jobLinkPlaceholder: 'Tempel URL pekerjaan atau deskripsi lengkap di sini...',
    uploadResume: 'Unggah Resume (PDF)',
    tailorResume: 'Sesuaikan Resume Saya',
    jobSummary: 'Ringkasan Pekerjaan',
    coverLetter: 'Penulis Surat Lamaran',
    resumeCoach: 'Pelatih Resume',
    jobFit: 'Analisis Kecocokan',
    addJob: '+ Tambah Lamaran',
    searchPlaceholder: 'Cari pekerjaan...',
    filterAll: 'Semua Status',
    statusNotApplied: 'Belum Apply',
    statusApplied: 'Sudah Apply',
    statusRejected: 'Reject',
    statusNoReply: 'No Reply',
    statusAccepted: 'Diterima',
    statusInterview: 'Menunggu Interview',
    companyName: 'Nama Perusahaan',
    position: 'Posisi',
    jobUrl: 'URL Pekerjaan',
    notes: 'Catatan',
    save: 'Simpan',
    cancel: 'Batal',
    processing: 'Memproses...',
    error: 'Terjadi kesalahan',
  },
  zh: {
    title: 'Job Matcher',
    jargon: 'Match your Dreamjob',
    aiTools: '人工智能工具',
    tracker: '申请追踪器',
    stats: '统计数据',
    jobLinkPlaceholder: '在此处粘贴工作链接或完整的职位描述...',
    uploadResume: '上传简历 (PDF)',
    tailorResume: '量身定制我的简历',
    jobSummary: '职位摘要',
    coverLetter: '求职信撰写',
    resumeCoach: '简历辅导',
    jobFit: '职位匹配度分析',
    addJob: '+ 添加申请',
    searchPlaceholder: '搜索职位...',
    filterAll: '所有状态',
    statusNotApplied: '未申请',
    statusApplied: '已申请',
    statusRejected: '被拒绝',
    statusNoReply: '无回复',
    statusAccepted: '已录用',
    statusInterview: '等待面试',
    companyName: '公司名称',
    position: '职位',
    jobUrl: '职位链接',
    notes: '备注',
    save: '保存',
    cancel: '取消',
    processing: '处理中...',
    error: '发生错误',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('id'); // Default to ID based on request tone

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = dictionaries[language];
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key; // fallback to key if not found
      }
    }
    return typeof result === 'string' ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
