import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layout/index.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录" },
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { title: "数据统计", icon: "DataAnalysis" },
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    redirect: "/user/list",
    meta: { title: "用户管理", icon: "User" },
    children: [
      {
        path: "list",
        name: "UserList",
        component: () => import("@/views/user/list.vue"),
        meta: { title: "用户列表", icon: "UserFilled" },
      },
      {
        path: "statistics",
        name: "UserStatistics",
        component: () => import("@/views/user/statistics.vue"),
        meta: { title: "用户统计", icon: "TrendCharts" },
      },
    ],
  },
  {
    path: "/content",
    component: Layout,
    redirect: "/content/list",
    meta: { title: "内容管理", icon: "Document" },
    children: [
      {
        path: "list",
        name: "ContentList",
        component: () => import("@/views/content/list.vue"),
        meta: { title: "内容列表", icon: "DocumentCopy" },
      },
      {
        path: "category",
        name: "ContentCategory",
        component: () => import("@/views/content/category.vue"),
        meta: { title: "内容分类", icon: "Folder" },
      },
      {
        path: "banner",
        name: "BannerManagement",
        component: () => import("@/views/content/banner.vue"),
        meta: { title: "轮播图管理", icon: "Picture" },
      },
      {
        path: "politic",
        name: "PoliticManagement",
        component: () => import("@/views/content/politic.vue"),
        meta: { title: "政治面貌管理", icon: "Collection" },
      },
      {
        path: "age-range",
        name: "AgeRangeManagement",
        component: () => import("@/views/content/age-range.vue"),
        meta: { title: "年龄段管理", icon: "Timer" },
      },
      {
        path: "difficulty",
        name: "DifficultyManagement",
        component: () => import("@/views/content/difficulty.vue"),
        meta: { title: "积分难度管理", icon: "Star" },
      },
      {
        path: "tag",
        name: "TagManagement",
        component: () => import("@/views/content/tag.vue"),
        meta: { title: "标签管理", icon: "CollectionTag" },
      },
      {
        path: "add",
        name: "ContentAdd",
        hidden: true,
        component: () => import("@/views/content/add.vue"),
        meta: { title: "添加内容", icon: "Plus" },
      },
    ],
  },
  {
    path: "/recommend",
    component: Layout,
    redirect: "/recommend/system",
    meta: { title: "推荐系统", icon: "MagicStick" },
    children: [
      {
        path: "system",
        name: "RecommendSystem",
        component: () => import("@/views/recommend/system.vue"),
        meta: { title: "推荐配置", icon: "Setting" },
      },
      {
        path: "analysis",
        name: "RecommendAnalysis",
        component: () => import("@/views/recommend/analysis.vue"),
        meta: { title: "推荐分析", icon: "DataLine" },
      },
    ],
  },
  {
    path: "/system",
    component: Layout,
    redirect: "/system/settings",
    meta: { title: "系统管理", icon: "Tools" },
    children: [
      {
        path: "settings",
        name: "SystemSettings",
        component: () => import("@/views/system/settings.vue"),
        meta: { title: "系统设置", icon: "Setting" },
      },
      {
        path: "role",
        name: "RoleManagement",
        component: () => import("@/views/content/role.vue"),
        meta: { title: "角色管理", icon: "UserFilled" },
      },
      {
        path: "permission",
        name: "PermissionManagement",
        component: () => import("@/views/content/permission.vue"),
        meta: { title: "权限管理", icon: "Lock" },
      },
    ],
  },
  // 无权限页面
  {
    path: "/no-permission",
    component: Layout,
    children: [
      {
        path: "",
        name: "NoPermission",
        component: () => import("@/views/error/no-permission.vue"),
        meta: { title: "无权限" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.path !== "/login" && !token) {
    next("/login");
  } else if (to.path === "/login" && token) {
    next("/");
  } else {
    next();
  }
});

export default router;
