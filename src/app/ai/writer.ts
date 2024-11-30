const writer = window.ai ? await window.ai.writer.create() : undefined;

export const writeWithAi = async (text: string) => {
  if (writer == null) {
    console.error("Writer API not available");
    return;
  }
  const result = await writer.write(text);
  return result;
};
