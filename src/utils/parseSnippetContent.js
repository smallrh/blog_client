export const parseSnippetContent = (rawContent) => {
  if (!rawContent) return null;
  try {
    const obj = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
    return obj;
  } catch (err) {
    console.error('parseSnippetContent: content is not valid JSON', err);
    return null;
  }
};