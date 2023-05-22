<!--
 * @Author: “zhouwang”
 * @Date: 2023-04-30 21:58:48
 * @LastEditors: “zhouwang”
 * @LastEditTime: 2023-05-11 10:58:39
 * @FilePath: \ShopManager\src\App.vue
 * @Description: App.vue
 * 
 * Copyright (c) 2023 by ZW, All Rights Reserved. 
-->
<script setup></script>

<template>
	<router-view></router-view>
</template>

<style lang="scss">
	body {
		@apply bg-gray-100;
	}

	#nprogress {
		.bar {
			background-color: #f4f4f4 !important;
			height: 3px !important;
		}
	}
	// 滚动条修改
	::-webkit-scrollbar {
		width: 4px;
		height: 6px;
	}

	::-webkit-scrollbar-corner {
		display: block;
	}

	::-webkit-scrollbar-thumb {
		border-radius: 8px;
		background-color: rgba(0, 0, 0, 0.2);
	}

	::-webkit-scrollbar-thumb,
	::-webkit-scrollbar-track {
		border-right-color: transparent;
		border-left-color: transparent;
		background-color: rgba(0, 0, 0, 0.1);
	}
</style>