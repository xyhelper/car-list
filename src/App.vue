<template>
  <div id="app">
    <tiny-layout class="tiny-layout-responsive-layout">
      <tiny-row :noSpace="true">
        <tiny-col :sm="0" :md="2" :lg="3" :xl="4">
          <div></div>
        </tiny-col>
        <tiny-col :sm="12" :md="8" :lg="6" :xl="4">
          <div v-html="notice"></div>
          <tiny-grid
            :loading="loading"
            :fetch-data="fetchData"
            seq-serial
            :pager="pagerConfig"
            :fit="true"
            size="medium"
            :auto-resize="true"
          >
            <tiny-grid-column
              v-if="isLargeScreen"
              type="index"
              width="35"
            ></tiny-grid-column>
            <tiny-grid-column
              v-if="isLargeScreen"
              field="carID"
              title="车队名称"
              align="center"
            ></tiny-grid-column>
            <tiny-grid-column
              v-if="!isLargeScreen"
              field="carID"
              title="车队名称"
              align="center"
              width="70"
            ></tiny-grid-column>

            <tiny-grid-column
              field="status"
              width="auto"
              title="状态"
              align="center"
            >
              <template #default="data">
                <img
                  class="status-img"
                  @click="goCar(data.row)"
                  alt="Endpoint Badge"
                  :src="`https://img.closeai.biz/endpoint?url=${data.row.encodeUrl}`"
                />
              </template>
            </tiny-grid-column>
            <tiny-grid-column
              v-if="isLargeScreen"
              field="carID"
              title="操作"
              align="center"
            >
              <template #default="data">
                <tiny-button
                  type="primary"
                  :icon="TinyIconEditorRedo"
                  @click="goCar(data.row)"
                >
                  访问
                </tiny-button>
              </template>
            </tiny-grid-column>
            <tiny-grid-column
              v-if="!isLargeScreen"
              field="carID"
              title="操作"
              align="center"
              width="60"
            >
              <template #default="data">
                <tiny-button
                  type="primary"
                  :icon="TinyIconEditorRedo"
                  @click="goCar(data.row)"
                ></tiny-button>
              </template>
            </tiny-grid-column>
          </tiny-grid>
          <div v-html="footer"></div>
        </tiny-col>
        <tiny-col :sm="0" :md="2" :lg="3" :xl="4">
          <div></div>
        </tiny-col>
      </tiny-row>
    </tiny-layout>
  </div>
</template>

<script>
import axios from "axios";
import {
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
  Layout as TinyLayout,
  Row as TinyRow,
  Col as TinyCol,
  Button as TinyButton,
} from "@opentiny/vue";
import { IconEditorRedo } from "@opentiny/vue-icon";
export default {
  name: "App",
  components: {
    TinyGrid,
    TinyGridColumn,
    TinyLayout,
    TinyRow,
    TinyCol,
    TinyButton,
  },
  data() {
    return {
      loading: false,
      TinyIconEditorRedo: IconEditorRedo(),
      pagerConfig: {
        attrs: {
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 20, 50],
          total: 0,
          align: "right", // 可选值：['left', 'center', 'right']
          layout: "total, prev, pager, next, sizes",
        },
      },
      fetchData: {
        api: this.init,
      },
      notice: "",
      fotter: "",
      windowWidth: window.innerWidth,
      baseUrl: window.location.origin,
      // baseUrl: "https://share.xyhelper.com.cn",
    };
  },
  computed: {
    isLargeScreen() {
      return this.windowWidth > 992;
    },
  },
  watch: {},
  beforeCreate() {},
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeMount() {},
  mounted() {
    // this.init();
  },
  beforeUpdate() {},
  updated() {},
  methods: {
    init({ page }) {
      this.loading = true;
      const { currentPage, pageSize } = page;
      return new Promise((resolve, reject) => {
        axios
          .request({
            method: "post",
            maxBodyLength: Infinity,
            url: "/carpage",
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              page: currentPage,
              size: pageSize,
              sort: "desc",
              order: "sort",
            },
          })
          .then((response) => {
            console.log(response.data);
            this.notice = response.data.notice;
            this.footer = response.data.footer;
            let listData = response.data.data.list.map((item) => {
              return {
                ...item,
                encodeUrl: encodeURIComponent(
                  `${this.baseUrl}/endpoint?carid=${encodeURI(item["carID"])}`
                ),
              };
            });
            resolve({
              result: listData,
              page: { total: response.data.data.pagination.total },
            });
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    goCar(row) {
      window.location.href = `${
        window.location.origin
      }/auth/login?carid=${encodeURI(row.carID)}`;
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
  },
  beforeDestroy() {},
  destroyed() {},
};
</script>

<style>
#app {
  padding: 0;
  margin: 0;
}
.tools {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.status-img {
  cursor: pointer;
}
.desktop {
  display: none;
}
.mobile {
  display: none;
}
@media (min-width: 800px) {
  .desktop {
    display: block;
  }
}
@media (max-width: 799px) {
  .mobile {
    display: block;
  }
}
</style>
