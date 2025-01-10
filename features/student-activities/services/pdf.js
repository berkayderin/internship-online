import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;

const pageStyle = {
  header: {
    fontSize: 24,
    bold: true,
    color: '#000000',
    alignment: 'center',
    margin: [0, 20, 0, 20],
  },
  subheader: {
    fontSize: 18,
    bold: true,
    color: '#000000',
    margin: [0, 15, 0, 10],
  },
  studentInfo: {
    fontSize: 12,
    margin: [0, 0, 0, 15],
    color: '#000000',
  },
  tableHeader: {
    bold: true,
    fontSize: 12,
    color: 'white',
    fillColor: '#000000',
    alignment: 'center',
  },
  tableCell: {
    fontSize: 11,
    color: '#000000',
    alignment: 'left',
    margin: [0, 5, 0, 5],
  },
  footer: {
    fontSize: 10,
    color: '#000000',
    alignment: 'center',
    margin: [0, 10, 0, 0],
  },
};

const convertHtmlToPlainText = (html) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const centeredTexts = tempDiv.querySelectorAll('p[style*="text-align: center"]');
  centeredTexts.forEach((text) => {
    text.textContent = `\n${text.textContent}\n`;
  });

  const paragraphs = tempDiv.querySelectorAll('p');
  paragraphs.forEach((p) => {
    // Boş paragrafları kaldır
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

  const text = tempDiv.innerText
    .split('\n')
    .filter((line) => line.trim())
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n');

  return text;
};

export const generateActivityReport = (student, activities) => {
  const docDefinition = {
    pageSize: {
      width: 595.28, // A4
      height: 841.89, // A4
    },
    pageMargins: [40, 20, 40, 20],
    footer: function (currentPage, pageCount) {
      return {
        columns: [
          {
            text: ['Bucak Bilgisayar ve Bilişim Fakültesi', '\nSayfa ', currentPage.toString(), ' / ', pageCount.toString()],
            style: 'footer',
            alignment: 'center',
          },
        ],
      };
    },
    content: [
      { text: 'Staj Defteri Raporu', style: 'header' },
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
      { text: 'Aktiviteler', style: 'subheader' },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*'],
          body: [
            [
              { text: 'Tarih', style: 'tableHeader' },
              { text: 'Aktivite İçeriği', style: 'tableHeader' },
            ],
            ...activities.map((activity) => [
              {
                text: new Date(activity.date).toLocaleDateString('tr-TR'),
                style: 'tableCell',
              },
              {
                text: convertHtmlToPlainText(activity.content),
                style: 'tableCell',
              },
            ]),
          ],
        },
      },
    ],
    styles: pageStyle,
    defaultStyle: {
      font: 'Roboto',
      color: '#000000',
    },
  };

  return pdfMake.createPdf(docDefinition);
};

export const generateSummaryReport = (student, summary) => {
  const formatSummaryContent = (summary) => {
    if (!Array.isArray(summary)) return { text: String(summary) };

    return summary.map((part) => {
      if (typeof part === 'string') return { text: part };
      return {
        text: part.text,
        bold: part.bold || false,
      };
    });
  };

  const docDefinition = {
    pageSize: {
      width: 595.28, // A4
      height: 841.89, // A4
    },
    pageMargins: [40, 20, 40, 20],
    footer: function (currentPage, pageCount) {
      return {
        columns: [
          {
            text: ['Bucak Bilgisayar ve Bilişim Fakültesi', '\nSayfa ', currentPage.toString(), ' / ', pageCount.toString()],
            style: 'footer',
            alignment: 'center',
          },
        ],
      };
    },
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
        text: formatSummaryContent(summary),
        style: 'tableCell',
        margin: [0, 10, 0, 0],
      },
    ],
    styles: pageStyle,
    defaultStyle: {
      font: 'Roboto',
      color: '#000000',
    },
  };

  return pdfMake.createPdf(docDefinition);
};
