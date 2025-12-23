export const parseArticleDate = (isoDate) => {
  if (!isoDate) {
    return null;
  }
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (dateOnlyMatch) {
    const year = Number(dateOnlyMatch[1]);
    const month = Number(dateOnlyMatch[2]) - 1;
    const day = Number(dateOnlyMatch[3]);
    const date = new Date(Date.UTC(year, month, day));
    return { date, isDateOnly: true };
  }

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return { date: parsed, isDateOnly: false };
};

export const formatShortDate = (isoDate) => {
  const parsed = parseArticleDate(isoDate);
  if (!parsed) {
    return null;
  }
  return parsed.date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    ...(parsed.isDateOnly ? { timeZone: 'UTC' } : {})
  });
};

export const formatLongDate = (isoDate) => {
  const parsed = parseArticleDate(isoDate);
  if (!parsed) {
    return null;
  }
  return parsed.date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(parsed.isDateOnly ? { timeZone: 'UTC' } : {})
  });
};
