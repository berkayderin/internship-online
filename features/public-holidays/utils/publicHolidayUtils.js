export const publicHolidayNames = {
	NEW_YEAR: 'Yılbaşı',
	RAMADAN: 'Ramazan Bayramı',
	NATIONAL_SOVEREIGNTY: 'Ulusal Egemenlik ve Çocuk Bayramı',
	LABOR_DAY: 'Emek ve Dayanışma Günü',
	COMMEMORATION_YOUTH: "Atatürk'ü Anma, Gençlik ve Spor Bayramı",
	SACRIFICE: 'Kurban Bayramı',
	DEMOCRACY: 'Demokrasi ve Milli Birlik Günü',
	VICTORY: 'Zafer Bayramı',
	REPUBLIC: 'Cumhuriyet Bayramı'
}

export const getPublicHolidayName = (type) => {
	return publicHolidayNames[type]
}
