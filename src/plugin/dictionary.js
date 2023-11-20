import { getConstant, getDictionary, getJavaCode } from '@/api/common/dict'

export const dict = {
  data() {
    return {
      constant: [],
      dictionary: [],
      javaCode: []
    }
  },
  methods: {
    async getDictionary(dictionaryConfig) {
      getDictionary(dictionaryConfig).then(res => {
        this.dictionary = res.data
      })
    },
    async getConstant(constantConfig) {
      getConstant(constantConfig).then(res => {
        this.constant = res.data
      })
    },
    async getJavaCode(javaCodeConfig) {
      getJavaCode(javaCodeConfig).then(res => {
        this.javaCode = res.data
      })
    }
  }
}
