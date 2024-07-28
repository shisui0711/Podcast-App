const apiKey = '1d1540473ce3483693b90663d348fc9c'; // Thay thế bằng API Key của bạn
const text = 'Xin chào thế giới!';
const language = 'vi-vn'; // Tiếng Việt

const apiUrl = `https://api.voicerss.org/?key=${apiKey}&hl=${language}&src=${encodeURIComponent(text)}&r=1`;

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Lỗi khi gọi API');
    }
    return response.arrayBuffer();
  })
  .then(blob => {
    const file = new File([blob], 'output.mp3', { type: 'audio/mpeg' });
    console.log('Đã tạo đối tượng File:', file);
    // Sử dụng đối tượng File ở đây...
  })
  .catch(error => {
    console.error('Lỗi:', error);
  });