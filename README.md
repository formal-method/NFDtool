# 模式分解工具-NF Decomposition Tool

------

## 目录

1. 项目简介
2. 项目使用效果图
3. 安装说明
4. 使用说明
5. 目录结构
6. 关于作者
7. 贡献者/贡献组织
8. 鸣谢
9. 版权信息
10. 更新日志

------

## 项目简介

### 项目定位

数据库原理教学工具（数据库设计辅助工具）

### 项目特点

自动模式分解

### 软件功能

- 计算闭包

  + 计算增广集
  + 计算传递依赖
  + 计算闭包

- 计算关键字

  + 计算主码
  + 计算候选码

- 计算最小依赖集

  + 依赖分解
  + 去除多余依赖
  + 去除多余属性
  + 计算最小依赖集

- 模式分解

  + 分解为2NF
  + 分解为3NF
  + 分解为BCNF
  + 分解过程展示

  

### 版本信息



## 效果图

![](https://gitee.com/formalization/schema_decomposition/raw/master/images/interface.png)

## 安装说明

### 环境依赖

无

### 部署安装

无

## 目录结构

```
├── index.html                  // 主页
├── js                          // 核心程序
│   ├── DatabaseTool.js         // 核心功能实现
│   ├── jquery-1.3.2.js         // js库 
│   └── mainStyle.js         	// 动画效果
├── css							// css样式
│   ├── mainStyle.css           // 主样式
│   └── lrtk.css                // 左侧导航栏样式      
├── images                      // 图片
├── demo                        // 操作演示
├── Readme.md                   // help
├── LICENSE.md              	// 版权信息
└── CONTRIBUTING.md         	 //贡献者/贡献组织

```

## 关于作者

作者姓名：李建清

作者单位：成都信息工程大学 -- 软件自动生成与智能服务四川省重点实验室

指导教师：蒋建民教授、赵卓宁教授

指导教师单位：成都信息工程大学 -- 软件自动生成与智能服务四川省重点实验室

联系方式：1102418305@qq.com

## 贡献者/贡献组织

请阅读 CONTRIBUTING.md 查阅为该项目做出贡献的开发者。

## 鸣谢

灵感来源于Armstrong公理系统

感谢蒋建民教授、赵卓宁教授的指导与支持

## 版权信息

该项目签署了LGPL-3.0 授权许可，详情请参阅 LICENSE.md

## 更新日志

### V1.0.0 版本，2021-03-12

下载地址： https://gitee.com/formalization/schema_decomposition