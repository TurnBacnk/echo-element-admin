<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="文件上传" width="400px" :show-close="false">
      <div slot="title" class="dialog-header">
        <span>文件上传</span>
        <el-button @click="downloadTemplate" type="text" class="download-button">模板下载</el-button>
      </div>
      <el-upload
        ref="upload"
        drag
        :action="actionUrl"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :headers="headers"
        :data="uploadData"
        :file-list="fileList"
        list-type="text"
        :http-request="customRequest"
        :on-remove="handleRemove"
        :auto-upload="false"
        :limit="1"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { getToken } from '@/utils/auth'

export default {
  name: 'UploadFile',
  props: {
    actionUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: Array,
      default: () => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'] // 默认允许xls以及xlsx
    },
    businessName: {
      type: String,
      default: '', // 默认为空
    },
  },
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      uploadData: {},
    };
  },
  methods: {
    beforeUpload(file) {
      // 检查文件类型是否符合要求
      if (this.fileType && !this.fileType.includes(file.type)) {
        this.$message.error(`只能上传${this.fileType}类型的文件`);
        return false; // 阻止上传
      }

      return true; // 允许上传
    },
    handleSuccess(response, file, fileList) {
      const { msg } = response
      // console.log('handleSuccess:', response, file, fileList);
      this.$modal.msgSuccess(response)
    },
    customRequest(param) {
      const formData = new FormData();
      formData.append('file', param.file);

      // 添加业务名参数
      if (this.businessName) {
        formData.append('businessName', this.businessName);
      }

      axios.post(process.env.VUE_APP_BASE_API + this.actionUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': getToken()
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload Progress: ' + percentCompleted + '%');
        },
      })
        .then((response) => {
          this.handleSuccess(response.data, null, this.fileList);
        })
        .catch((error) => {
          console.error('Upload Error:', error);
        });
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    submitUpload() {
      this.$refs.upload.submit()
      this.dialogVisible = false;
    },
    downloadTemplate() {
      // 添加下载模板
      // 使用相对路径下载模板
      const templateUrl = `/template/userTemplate.xlsx`;
      window.open(templateUrl, '_blank');
    }
  },
};
</script>

<style scoped>

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.download-button {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
}

.el-dialog {
  border-radius: 10px; /* 设置对话框的圆角 */
  overflow: hidden; /* 防止内容溢出圆角 */
}

.drag-container {
  padding: 20px;
  text-align: center;
  border: 2px dashed #409EFF;
  background-color: #f0f9eb;
  color: #67c23a;
  cursor: pointer;
  border-radius: 8px;
}

.drag-container em {
  color: #409EFF;
  text-decoration: underline;
}

.dialog-footer {
  padding: 10px;
  text-align: right;
}

</style>
