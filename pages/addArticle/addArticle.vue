<template>
	<view class="container">
		<view class="header">
			<!-- <switch :checked="readOnly" @change="readOnly = !readOnly" /> -->
			<u-form :model="form" ref="uForm" label-width="140">
				<u-form-item label="文章标题"><u-input v-model="form.title" /></u-form-item>
			</u-form>
		</view>
		<view class="editor">
			<sp-editor editorId="editor" :toolbar-config="toolbarConfig" :readOnly="readOnly" @input="inputOver"
				@upinImage="upinImage" @upinVideo="upinVideo" @init="initEditor" @overMax="overMax"
				@exportHtml="exportHtml" @addLink="addLink"></sp-editor>
		</view>

		<view class="footer">
			<u-button type="primary" @click="save">提交</u-button>
		</view>
	</view>
</template>

<script>
	import {
		convertImgStylesToAttributes,
		handleHtmlWithVideo
	} from '@/uni_modules/sp-editor/utils'
	import * as api from '@/api/article.js'
	export default {
		data() {
			return {
				editorIns: null,
				readOnly: false,
				toolbarConfig: {
					excludeKeys: ['direction', 'date', 'lineHeight', 'letterSpacing', 'listCheck'],
					iconSize: '20px',
					iconColumns: 10
				},
				mediaQueryOb: null, // 响应式媒体查询，

				form: {
					title: '',
					html: '',
					text: ''
				},
			}
		},
		onLoad(option) {
			this.id = option.id
			uni.setNavigationBarTitle({
				title: this.id ? '编辑文章' : '新增文章'
			})
			// if (this.id) {
			// 	this.getDetail()
			// }
		},
		mounted() {
			this.testMediaQueryObserver()
		},
		destroyed() {
			this.mediaQueryOb.disconnect() //组件销毁时停止媒体查询监听
			this.mediaQueryOb = null
			console.log('==== destroyed :')
		},
		methods: {
			/**
			 * 媒体查询 - 响应式处理一些东西
			 */
			testMediaQueryObserver() {
				this.mediaQueryOb = uni.createMediaQueryObserver(this)
				this.mediaQueryOb.observe({
						minWidth: 0, //页面最小宽度 0px
						maxWidth: 500 //页面宽度最大 500px
					},
					(matches) => {
						console.log('==== 开启媒体查询 :', matches)
						if (matches) {
							// 页面宽度在0-500px时
							this.toolbarConfig.iconColumns = 12
						} else {
							this.toolbarConfig.iconColumns = 16
						}
					}
				)
			},
			/**
			 * 获取输入内容
			 * @param {Object} e {html,text} 内容的html文本，和text文本
			 */
			inputOver(e) {
				console.log('==== inputOver :', e)
				this.form.html = e.html
				this.form.text = e.text
			},
			/**
			 * 超出最大内容限制
			 * @param {Object} e {html,text} 内容的html文本，和text文本
			 */
			overMax(e) {
				console.log('==== overMax :', e)
			},
			/**
			 * 编辑器就绪
			 * @param {Object} editor 编辑器实例，你可以自定义调用editor实例的方法
			 * @tutorial editor组件 https://uniapp.dcloud.net.cn/component/editor.html#editor-%E7%BB%84%E4%BB%B6
			 * @tutorial 相关api https://uniapp.dcloud.net.cn/api/media/editor-context.html
			 */
			initEditor(editor) {
				this.editorIns = editor // 保存编辑器实例
				this.preRender()
			},
			preRender() {
				// 初始化编辑器内容
				// uni.showLoading({
				//   title: '数据加载中...'
				// })
				// setTimeout(() => {
				//   const htmlContent = `<div><strong>猫猫</strong> <a href="http://www.baidu.com">百度</a>\n<img style="width:100px;height:50px;" src="https://img.yzcdn.cn/vant/cat.jpeg"  />\n<i>yaho</i> giao\n<img width="200px" src="https://img.yzcdn.cn/vant/cat.jpeg"/></div>\n`
				//   const handleHtml = convertImgStylesToAttributes(htmlContent)
				//   console.log(handleHtml);
				//   this.editorIns.setContents({
				//     html: handleHtml
				//   })
				//   uni.hideLoading()
				// }, 1000)
				// setTimeout(() => {
				//   /**
				//    * 光标默认在第一个，所以默认会在最前面插入内容
				//    * 注意：
				//    * 由于官方editor组件在不同平台是基于各平台对应的富文本技术实现
				//    * 因此insertText方法可能存在在安卓app正常，但是其他平台在插入内容的时候会移动光标聚焦
				//    * 导致焦点回滚到视口处的问题，因此尽量避免初始化的时候使用insertText插入内容
				//    * 可使用setContents初始化内容代替，但是要注意的时，setContents会将所有内容整体初始化，而不是插入内容
				//    */
				//   this.editorIns.insertText({ text: 'Hello！' })
				// }, 1000)
			},
			/**
			 * 直接运行示例工程插入图片无法正常显示的看这里
			 * 因为插件默认采用云端存储图片的方式
			 * 以$emit('upinImage', tempFiles, this.editorCtx)的方式回调
			 * @param {Object} tempFiles
			 * @param {Object} editorCtx
			 */
			upinImage(tempFiles, editorCtx) {
				/**
				 * 本地临时插入图片预览
				 * 注意：这里仅是示例本地图片预览，因为需要将图片先上传到云端，再将图片插入到编辑器中
				 * 正式开发时，还请将此处注释，并解开下面 使用 uniCloud.uploadFile 上传图片的示例方法 的注释
				 * @tutorial https://uniapp.dcloud.net.cn/api/media/editor-context.html#editorcontext-insertimage
				 */
				// // #ifdef MP-WEIXIN
				// // 注意微信小程序的图片路径是在tempFilePath字段中
				// editorCtx.insertImage({
				// 	src: tempFiles[0].tempFilePath,
				// 	width: '80%', // 默认不建议铺满宽度100%，预留一点空隙以便用户编辑
				// 	success: function() {}
				// })
				// // #endif

				// // #ifndef MP-WEIXIN
				// editorCtx.insertImage({
				// 	src: tempFiles[0].path,
				// 	width: '80%', // 默认不建议铺满宽度100%，预留一点空隙以便用户编辑
				// 	success: function() {}
				// })
				// // #endif

				/**
				 * 使用 uniCloud.uploadFile 上传图片的示例方法（可适用多选上传）
				 * 正式开发环境中，请将上面 本地临时插入图片预览 注释后，模仿以下写法
				//  */
				tempFiles.forEach((item) => {
					console.log(item);
					const baseUrl = uni.getStorageSync('baseUrl')
					const token =  uni.getStorageSync('token')
					uni.uploadFile({
						url: baseUrl + '/upload',
						filePath: item.path,
						header: {
							'Authorization': token
						},
						name: 'file', // 根据服务器要求设置文件参数名
						success: (uploadRes) => {
							console.log('文件上传成功', uploadRes);
							// 可以根据服务器返回的结果进行相应处理
							const res = JSON.parse(uploadRes.data)
							if (res.code === 0) {
								const imgUrl = baseUrl + '/file/' + res.data
								editorCtx.insertImage({
									src: imgUrl,
									width: '80%', // 默认不建议铺满宽度100%，预留一点空隙以便用户编辑
									success: () => {
										console.log('插入图片成功')
									},
								})
							}

						},
						fail: (error) => {
							console.error('文件上传失败', error);
						}
					});
				})
			},
			upinVideo(tempFilePath, editorCtx) {
				// 此处tempFilePath为本地视频临时地址，请对接后端接口将视频上传后，获取真实地址，再插入到编辑器中
				// 上传视频，并获取视频真实地址（其实和上面插入图片的步骤差不多）
				const baseUrl = uni.getStorageSync('baseUrl')
				const token =  uni.getStorageSync('token')
				uni.uploadFile({
					url: baseUrl + '/upload',
					filePath: tempFilePath.path,
					header: {
						'Authorization': token
					},
					name: 'file', // 根据服务器要求设置文件参数名
					success: (uploadRes) => {
						console.log('文件上传成功', uploadRes);
						// 可以根据服务器返回的结果进行相应处理
						const res = JSON.parse(uploadRes.data)
						if (res.code === 0) {
							const videoUrl = baseUrl + '/file/' + res.data
							// 插入一张图片占位（uni-editor无法直接插入video标签，所以需要以图片占位）
							editorCtx.insertImage({
								src: 'https://img.zcool.cn/community/01055859b8e37fa8012075341db67f.gif',
								width: '80%', // 默认不建议铺满宽度100%，预留一点空隙以便用户编辑
								alt: videoUrl, // 携带视频真实地址
								success: () => {}
							})
						}

					},
					fail: (error) => {
						console.error('文件上传失败', error);
					}
				});
				
			},
			/**
			 * 导出
			 * @param {string} e 导出的html内容
			 */
			exportHtml(e) {
				// 若携带视频，需按需导入handleHtmlWithVideo方法处理富文本，再导出
				const temphtml = handleHtmlWithVideo(e)
				uni.navigateTo({
					url: '/pages/out/out',
					success(res) {
						res.eventChannel.emit('e-transmit-html', {
							data: temphtml
						})
					}
				})
			},
			/**
			 * 添加超链接
			 * @param {Object} e { text: '链接描述', href: '链接地址' }
			 */
			addLink(e) {
				console.log('==== addLink :', e)
			},
			save() {
				api.saveArticle(this.form).then(res => {
					console.log(res)
					if (res.code === 0) {
						uni.showToast({
								title: '保存成功',
								icon: 'success',
								duration: 2000
							})
						uni.switchTab({
							url: '/pages/index/index'
						})
					} else {
						uni.showToast({
							title: '保存失败',
							icon: 'none',
							duration: 2000
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.container {
		height: 100%;
		padding: 12px;
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.header {
		height: 100rpx;
	}

	.editor {
		flex: 1;
	}

	.footer {
		height: 100rpx;
	}
</style>