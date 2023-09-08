<template>
    <div>
      <!-- input 元素用于选择文件 -->
      <input type="file" ref="fileInput" @change="handleFileChange" />
  
      <!-- 开始上传和取消上传按钮 -->
      <button @click="startUpload">开始上传</button>
      <button @click="cancelUpload">取消上传</button>
  
      <!-- 显示上传进度和错误信息 -->
      <div v-if="uploadProgress !== null">上传进度：{{ uploadProgress }}%</div>
      <div v-if="uploadError">上传错误：{{ uploadError }}</div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      // 使用 ref 创建响应式变量
      const file = ref(null); // 选中的文件
      const uploadProgress = ref(null); // 上传进度
      const uploadError = ref(null); // 上传错误信息
      const uploadedChunks = ref([]); // 已上传的分片索引
  
      // 选择文件后的处理函数
      const handleFileChange = () => {
        // 使用 ref 创建的响应式变量可以直接通过 .value 访问其值
        file.value = document.querySelector('#fileInput').files[0];
      };
  
      // 开始上传按钮点击事件处理函数
      const startUpload = async () => {
        if (!file.value) {
          // 如果没有选择文件，提示用户选择一个文件
          console.log('请选择一个文件。');
          return;
        }
  
        const chunkSize = 10 * 1024 * 1024; // 10MB 为一个分片大小
  
        // 创建一个新的 Web Worker 来执行上传任务
        const worker = new Worker('worker.js');
  
        // 计算文件哈希值
        worker.postMessage({ action: "calculateHash", file: file.value });
  
        // 监听来自 Web Worker 的消息，即计算哈希值的结果
        worker.onmessage = (e) => {
          const { action, hash } = e.data;
  
          if (action === "hashCalculated") {
            console.log('文件哈希值：', hash);
            // 在这里添加将哈希值发送给后端的代码
            // ...
  
            // 开始上传文件分片
            worker.postMessage({
              action: "startUpload",
              file: file.value,
              chunkSize: chunkSize,
              uploadedChunks: uploadedChunks.value,
            });
          } else if (action === "uploadProgress") {
            // 更新上传进度
            uploadProgress.value = e.data.progress;
          } else if (action === "uploadComplete") {
            // 上传完成
            console.log('文件上传完成');
            // 在这里添加上传完成后的处理代码
            // ...
  
            // 清理 Web Worker
            worker.terminate();
          }
        };
      };
  
      // 取消上传按钮点击事件处理函数
      const cancelUpload = () => {
        // 取消上传，暂未实现，您可以根据需要进行实现
      };
  
      // 返回 setup 函数中需要暴露给模板的数据和方法
      return {
        handleFileChange,
        startUpload,
        cancelUpload,
        file,
        uploadProgress,
        uploadError,
      };
    },
  };