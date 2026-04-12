export function getApiErrorMessage(err, fallback = 'Có lỗi xảy ra') {
  if (!err) return fallback

  if (err.code === 'ECONNABORTED' || (typeof err.message === 'string' && err.message.includes('timeout'))) {
    return 'Không nhận được phản hồi từ server (quá lâu). Kiểm tra service đã bật, IP/port trong .env, và mạng LAN. Sửa .env xong nhớ chạy lại npm run dev.'
  }

  if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
    return 'Không kết nối được server. Kiểm tra URL, firewall, hoặc thử bật VITE_USE_PROXY=true trong .env rồi chạy lại npm run dev.'
  }

  const d = err.response?.data
  if (typeof d === 'string') return d
  if (d && typeof d === 'object' && d.message) return String(d.message)
  if (d && typeof d === 'object' && d.error) {
    return typeof d.error === 'string' ? d.error : JSON.stringify(d.error)
  }

  if (typeof err.message === 'string' && err.message) return err.message
  return fallback
}
