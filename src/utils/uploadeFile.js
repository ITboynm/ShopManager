// import * as SparkMD5 from "spark-md5";

// 建议放在web worker里面去 如果文件过大，就会采取先分大块，一块块分块上传

// inputEmits.onchange = async (e) => {
//   const file = inp.files[0];
//   if (!file) return;
//   // const piece = file.slice(0,100) //0-99个字节
//   //   以10兆分片
//   const chunks = createChunks(file, 10 * 1024 * 1024);
//   const result = await hash(chunks);
//   console.log(result);
//   //   在这发送请求
// };

// // 算文件的hash值 增量算法 拿一块算完扔掉，下一块待着上一块的结果继续
// function hash(chunks) {
//   return new Promise((resolve) => {
//     const spark = new SparkMD5();
//     function _read(i) {
//       if (i > chunks.length) {
//         console.log(spark.end());
//         resolve(spark.end());
//         return; //读取完成
//       }
//       const blob = chunks[i];
//       //读文件
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const bytes = e.target.result; //读取到的字节数组
//         //   把一组字节加到增量当中
//         spark.append(bytes);
//         _read(i + 1);
//       };
//       //读取分块字节数组
//       reader.readAsArrayBuffer(blob);
//     }
//     _read(0);
//   });
// }

// // 切片函数
// function createChunks(file, chunkSize) {
//   const result = [];
//   for (let i = 0; i < file.size; i += chunkSize) {
//     // 切片数组
//     result.push(file.slice(i, i + chunkSize));
//   }
//   return result;
// }



// Vue 部分

// <template>
//   <div>
//     <!-- input 元素用于选择文件 -->
//     <input type="file" ref="fileInput" @change="handleFileChange" />

//     <!-- 开始上传和取消上传按钮 -->
//     <button @click="startUpload">开始上传</button>
//     <button @click="cancelUpload">取消上传</button>

//     <!-- 显示上传进度和错误信息 -->
//     <div v-if="uploadProgress !== null">上传进度：{{ uploadProgress }}%</div>
//     <div v-if="uploadError">上传错误：{{ uploadError }}</div>
//   </div>
// </template>

// <script>
// import { ref } from 'vue';

// export default {
//   setup() {
//     // 使用 ref 创建响应式变量
//     const file = ref(null); // 选中的文件
//     const uploadProgress = ref(null); // 上传进度
//     const uploadError = ref(null); // 上传错误信息
//     const uploadedChunks = ref([]); // 已上传的分片索引

//     // 选择文件后的处理函数
//     const handleFileChange = () => {
//       // 使用 ref 创建的响应式变量可以直接通过 .value 访问其值
//       file.value = document.querySelector('#fileInput').files[0];
//     };

//     // 开始上传按钮点击事件处理函数
//     const startUpload = async () => {
//       if (!file.value) {
//         // 如果没有选择文件，提示用户选择一个文件
//         console.log('请选择一个文件。');
//         return;
//       }

//       const chunkSize = 10 * 1024 * 1024; // 10MB 为一个分片大小

//       // 创建一个新的 Web Worker 来执行上传任务
//       const worker = new Worker('worker.js');

//       // 计算文件哈希值
//       worker.postMessage({ action: "calculateHash", file: file.value });

//       // 监听来自 Web Worker 的消息，即计算哈希值的结果
//       worker.onmessage = (e) => {
//         const { action, hash } = e.data;

//         if (action === "hashCalculated") {
//           console.log('文件哈希值：', hash);
//           // 在这里添加将哈希值发送给后端的代码
//           // ...

//           // 开始上传文件分片
//           worker.postMessage({
//             action: "startUpload",
//             file: file.value,
//             chunkSize: chunkSize,
//             uploadedChunks: uploadedChunks.value,
//           });
//         } else if (action === "uploadProgress") {
//           // 更新上传进度
//           uploadProgress.value = e.data.progress;
//         } else if (action === "uploadComplete") {
//           // 上传完成
//           console.log('文件上传完成');
//           // 在这里添加上传完成后的处理代码
//           // ...

//           // 清理 Web Worker
//           worker.terminate();
//         }
//       };
//     };

//     // 取消上传按钮点击事件处理函数
//     const cancelUpload = () => {
//       // 取消上传，暂未实现，您可以根据需要进行实现
//     };

//     // 返回 setup 函数中需要暴露给模板的数据和方法
//     return {
//       handleFileChange,
//       startUpload,
//       cancelUpload,
//       file,
//       uploadProgress,
//       uploadError,
//     };
//   },
// };



// 导入 SparkMD5 库
importScripts("https://cdn.jsdelivr.net/npm/spark-md5@4.0.0/spark-md5.min.js");

// 定义全局变量
let currentChunk = 0;
let totalChunks = 0;
let fileHash = null;

// 监听来自主线程的消息事件
self.addEventListener("message", async (e) => {
  const { action, file, chunkSize, uploadedChunks } = e.data;

  if (action === "calculateHash") {
    // 计算文件哈希值
    fileHash = await calculateFileHash(file);
    // 发送计算结果到主线程
    self.postMessage({ action: "hashCalculated", hash: fileHash });
  } else if (action === "startUpload") {
    // 设置上传参数
    currentChunk = uploadedChunks.length;
    totalChunks = Math.ceil(file.size / chunkSize);

    // 上传文件分片
    for (let i = currentChunk; i < totalChunks; i++) {
      const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
      // 模拟上传分片到服务器（实际应使用后端接口）
      // 这里使用 setTimeout 模拟异步上传
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // 发送上传进度到主线程
      self.postMessage({
        action: "uploadProgress",
        progress: ((i + 1) / totalChunks) * 100,
      });
    }

    // 上传完成后发送消息到主线程
    self.postMessage({ action: "uploadComplete" });
  }
});

// 算文件的哈希值，增量算法
function calculateFileHash(file) {
  return new Promise((resolve, reject) => {
    const spark = new self.SparkMD5.ArrayBuffer();
    const reader = new FileReader();

    reader.onload = (e) => {
      spark.append(e.target.result);
      resolve(spark.end());
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsArrayBuffer(file);
  });
}