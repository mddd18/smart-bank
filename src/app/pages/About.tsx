import { Info, ShieldCheck, BrainCircuit, QrCode, Database, Zap } from 'lucide-react';

export function About() {
  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Info className="h-7 w-7 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Loyiha haqida</h1>
          <p className="text-gray-500 text-sm">Smart Bank - Aktivlarni aqlli boshqarish tizimi</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Smart Bank AMS (Asset Management System)</h2>
        <p className="text-gray-600 leading-relaxed mb-8">
          Ushbu tizim yirik ofislar va banklar uchun jihozlarni (aktivlarni) raqamli tarzda boshqarish, xodimlarga biriktirish va ularning holatini doimiy nazorat qilish uchun mo'ljallangan. Tizim an'anaviy qog'ozbozlik va Excel jadvallarini to'liq avtomatlashtirib, yo'qotishlarning oldini oladi va iqtisodiy samaradorlikni oshiradi.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-6">Tizimning asosiy imkoniyatlari:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="shrink-0 mt-1">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                <Database className="h-5 w-5" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Markazlashgan Baza (Supabase)</h4>
              <p className="text-sm text-gray-600 mt-1">Barcha jihozlar, xodimlar va bo'limlar ma'lumotlari yagona, xavfsiz bulutli bazada saqlanadi.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 mt-1">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                <QrCode className="h-5 w-5" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">QR Kod Skanerlash</h4>
              <p className="text-sm text-gray-600 mt-1">Har bir jihozga QR kod biriktiriladi. Skanerlash orqali jihoz egasi va holatini soniyalarda aniqlash mumkin.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 mt-1">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                <BrainCircuit className="h-5 w-5" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Sun'iy Intellekt Tahlili</h4>
              <p className="text-sm text-gray-600 mt-1">AI algoritmlari jihozlarning yaroqlilik muddatini tahlil qilib, buzilish xavfini (Risk Score) oldindan bashorat qiladi.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 mt-1">
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Audit va Tarix</h4>
              <p className="text-sm text-gray-600 mt-1">Jihoz bilan bog'liq har bir harakat (kimga berildi, qachon ta'mirlandi) tizim xotirasida muhrlanadi.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 p-5 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4">
          <Zap className="h-6 w-6 text-blue-600 shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900">Texnologiyalar steki</h4>
            <p className="text-sm text-blue-800 mt-1">
              React, TypeScript, Tailwind CSS, Vite, Supabase (PostgreSQL), Recharts, Lucide Icons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
