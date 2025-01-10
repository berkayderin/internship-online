import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retryOperation = async (operation, maxAttempts = 3, delayMs = 2000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) throw error;

      if (error?.error?.code === 503) {
        console.log(`Deneme ${attempt}/${maxAttempts} başarısız. Yeniden deneniyor...`);
        await delay(delayMs * attempt);
        continue;
      }

      throw error;
    }
  }
};

export const summarizeActivities = async (activities) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    const chatSession = model.startChat();

    const convertHtmlToText = (html) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      const centeredTexts = tempDiv.querySelectorAll('p[style*="text-align: center"]');
      centeredTexts.forEach((text) => {
        text.textContent = `\n${text.textContent}\n`;
      });

      const paragraphs = tempDiv.querySelectorAll('p');
      paragraphs.forEach((p) => {
        if (!p.textContent.trim()) {
          p.remove();
          return;
        }
        p.textContent = p.textContent.replace(/\s+/g, ' ').trim();
      });

      const lists = tempDiv.querySelectorAll('ul, ol');
      lists.forEach((list) => {
        const items = list.querySelectorAll('li');
        items.forEach((item, index) => {
          const bullet = list.tagName === 'UL' ? '• ' : `${index + 1}. `;
          item.textContent = `${bullet}${item.textContent.trim()}`;
        });
      });

      return tempDiv.innerText
        .split('\n')
        .filter((line) => line.trim())
        .join('\n')
        .replace(/\n{3,}/g, '\n\n');
    };

    const activitiesText = activities
      .map(
        (activity) => `Tarih: ${new Date(activity.date).toLocaleDateString('tr-TR')}\n` + `İçerik: ${convertHtmlToText(activity.content)}\n`
      )
      .join('\n');

    const prompt = `Aşağıdaki staj aktivitelerini analiz et ve iki bölümden oluşan bir yanıt ver. 
Sadece teknoloji isimleri, programlama dilleri, yazılım araçları ve önemli teknik kavramları **kelime** şeklinde belirt. 
Normal cümle yapısındaki kelimeleri kalınlaştırma.

1. Özet: Aktiviteleri profesyonel bir dille özetle. Öğrencinin yaptığı işleri, öğrendiği teknolojileri ve kazandığı deneyimleri vurgula. Özet kısa olmalı.

2. Değerlendirme: Aktiviteleri aşağıdaki kriterlere göre değerlendir ve detaylı gerekçesiyle birlikte bir seviye belirt:
- Kötü: Yetersiz aktivite ve öğrenme
- Orta: Temel düzeyde aktivite ve öğrenme
- İyi: Tatmin edici düzeyde aktivite ve öğrenme
- Çok iyi: Beklentilerin üzerinde aktivite ve öğrenme
- Mükemmel: Olağanüstü performans ve öğrenme

Örnek kalınlaştırma:
- Doğru: Stajyer **React.js**, **Node.js** ve **MongoDB** teknolojilerini kullanarak web uygulaması geliştirdi.
- Yanlış: **Stajyer** React.js, Node.js ve MongoDB **teknolojilerini** **kullanarak** web uygulaması **geliştirdi**.

Aktiviteler:
${activitiesText}`;

    const result = await retryOperation(async () => {
      return await Promise.race([
        chatSession.sendMessage(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error('API isteği zaman aşımına uğradı')), 30000)),
      ]);
    });

    const text = result.response.text();

    const formattedText = text.split(/(\*\*[^*]+\*\*)/).map((part) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return { text: part.slice(2, -2), bold: true };
      }
      return { text: part };
    });

    return formattedText;
  } catch (error) {
    console.error('Summarize activities error:', error);
  }
};

export const generateSummaryReport = (student, summary) => {
  const docDefinition = {
    content: [
      { text: 'Staj Aktiviteleri Özet Raporu', style: 'header' },
      {
        style: 'studentInfo',
        table: {
          widths: ['auto', '*'],
          body: [
            [{ text: 'Öğrenci:', bold: true }, `${student.firstName} ${student.lastName}`],
            [{ text: 'Bölüm:', bold: true }, student.department],
          ],
        },
        layout: 'noBorders',
      },
      { text: 'Yapay Zeka Değerlendirmesi', style: 'subheader' },
      {
        text: summary,
        style: 'tableCell',
        margin: [0, 10, 0, 0],
      },
    ],
  };

  return pdfMake.createPdf(docDefinition);
};
