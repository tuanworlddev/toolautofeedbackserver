function removeMarkdown(text) {
  return text
    // Bỏ in đậm/in nghiêng ( **text** hoặc *text* hoặc _text_ )
    .replace(/(\*\*|__)(.*?)\1/g, '$2')   // bold
    .replace(/(\*|_)(.*?)\1/g, '$2')      // italic
    // Bỏ mã code đơn (`code`)
    .replace(/`([^`]+)`/g, '$1')
    // Bỏ liên kết dạng [text](url)
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    // Bỏ tiêu đề markdown (# Title)
    .replace(/^#{1,6}\s*(.*)/gm, '$1')
    // Bỏ danh sách có đánh số
    .replace(/^\s*\d+\.\s+/gm, '')
    // Bỏ danh sách không đánh số (* item, - item)
    .replace(/^\s*[-*+]\s+/gm, '')
    // Bỏ dòng trống thừa
    .replace(/\n{2,}/g, '\n\n')
    // Bỏ dấu xuống dòng cuối nếu có
    .trim();
}

module.exports = { removeMarkdown }