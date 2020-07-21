export function replaceAll(
  originalText: string,
  findText: string,
  repText: string
) {
  var regExp = new RegExp(findText, 'g')
  return originalText.replace(regExp, repText)
}
