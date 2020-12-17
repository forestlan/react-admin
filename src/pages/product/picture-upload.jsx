import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDelImg } from "../../api/index";

export default class PictureUpload extends Component {
    static propTypes = {
        imgs: PropTypes.array
    }

    // state = {
    //     previewVisible: false,
    //     previewImage: '',
    //     previewTitle: '',
    //     fileList: [

    //     ]
    // };
    constructor(props) {
        super(props)
        let fileList = []
        // 如果传入了 imgs, 生成一个对应的 fileList 
        const imgs = this.props.imgs
        // console.log(imgs);
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done', // loading: 上传中, done: 上传完成, remove: 删除 
                url: 'http://localhost:5000/upload/' + img
            }))
        }//初始化状态 
        this.state = {
            previewVisible: false, // 是否显示大图预览 
            previewImage: '', // 大图的 url 
            previewTitle: '',
            fileList: fileList // 所有需要显示的图片信息对象的数组 
        }
    }
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }
    getBase64 = (file) => {
        // console.log(file);
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = async ({ file, fileList }) => {
        // console.log(file);
        if (file.status === 'done') {
            const result = file.response
            // debugger
            // const fileList = this.state
            if (result.status === 0) {
                message.success('上传成功了')
                const { name,url} = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传失败了')
            }
        } else if (file.status === 'removed') {//删除图片
            const result = await reqDelImg(file.name)
            if (result.status === 0) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        }
        this.setState({ fileList })
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    name='image'
                    accept='images/*'
                    action="/manage/img/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        )
    }
}
