import CryptoJS from 'crypto-js'

const defaultKey = CryptoJS.enc.Utf8.parse(decryptByBase64('Qm9jbG91ZENNUFY1ODchIQ=='))
const iv = CryptoJS.enc.Utf8.parse(decryptByBase64('QmV5b25kQ01QVjU4NyEhIQ=='))
const options = {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
}

// 加密方法
export function encrypt (word, key = defaultKey) {
  if (typeof word === 'object') {
    word = JSON.stringify(word)
  }
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, options)
  return encrypted.toString()
}

// 解密方法
export function decrypt (word, key = defaultKey) {
  const decrypt = CryptoJS.AES.decrypt(word, key, options)
  return decrypt.toString(CryptoJS.enc.Utf8)
}

// base64解码
function decryptByBase64 (word) {
  const base64string = CryptoJS.enc.Base64.parse(word)
  return CryptoJS.enc.Utf8.stringify(base64string)
}

// base64编码
function encryptByBase64 (word) {
  const src = CryptoJS.enc.Utf8.parse(word)
  const base64string = CryptoJS.enc.Base64.stringify(src)
  return base64string
}

export default {
  encrypt,
  decrypt,
  encryptByBase64,
  decryptByBase64
}
