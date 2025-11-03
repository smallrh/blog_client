"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./styles.module.scss"

interface FormData {
  email: string
  password: string
}

const Auth: React.FC = () => {
  // 当前页面暂时不使用翻译功能
  const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // 获取当前主题
  useEffect(() => {
    const currentTheme =
      localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    setIsDarkMode(currentTheme === "dark")

    // 监听主题变化
    const handleThemeChange = () => {
      const themeProvider = document.getElementById("theme-provider")
      if (themeProvider) {
        setIsDarkMode(themeProvider.getAttribute("data-theme") === "dark")
      }
    }

    window.addEventListener("storage", (e) => {
      if (e.key === "theme") {
        setIsDarkMode(e.newValue === "dark")
      }
    })

    return () => {
      window.removeEventListener("storage", handleThemeChange)
    }
  }, [])

  // 表单输入处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // 清除对应字段的错误
    if (errors[name as keyof FormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof FormData]
        return newErrors
      })
    }
  }

  // 表单验证
  const validateForm = () => {
    const newErrors: Partial<FormData> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // 模拟API请求
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Login successful", formData)

      // 登录成功后重定向到首页
      navigate("/")
    } catch (error) {
      console.error("Login failed", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 处理忘记密码
  const handleForgotPassword = () => {
    console.log("Forgot password clicked")
    // 可以添加忘记密码的逻辑或导航
  }

  // 处理注册
  const handleRegister = () => {
    console.log("Register clicked")
    // 可以添加注册的逻辑或导航
  }

  const themeClass = isDarkMode ? "dark-mode" : "light-mode"

  // 处理主题切换时的动画效果
  const handleThemeToggle = () => {
    // 获取主题切换按钮元素
    const themeButton = document.querySelector(`.${styles["theme-toggle-button"]}`)
    if (themeButton) {
      // 添加点击类以触发圆形扩散动画
      themeButton.classList.add("clicked")

      // 更新主题
      const newTheme = !isDarkMode
      document.documentElement.classList.toggle("dark-mode", newTheme)
      document.documentElement.classList.toggle("light-mode", !newTheme)
      localStorage.setItem("theme", newTheme ? "dark" : "light")
      setIsDarkMode(newTheme)

      const themeProvider = document.getElementById("theme-provider")
      if (themeProvider) {
        themeProvider.setAttribute("data-theme", newTheme ? "dark" : "light")
      }

      window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme: newTheme ? "dark" : "light" } }))

      // 动画结束后移除clicked类
      setTimeout(() => {
        themeButton.classList.remove("clicked")
      }, 600)
    }
  }

  return (
    <div className={`${styles["auth-container"]} ${themeClass}`}>
      {/* 主题切换按钮 - 屏幕左下角 */}
      <button
        className={styles["theme-toggle-button"]}
        onClick={handleThemeToggle}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      <div className={styles["auth-card"]}>
        {/* 用户图标 */}
        <div className={styles["user-icon-container"]}>
          <div className={styles["user-icon-circle"]}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles["user-icon"]}
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className={styles["auth-form"]}>
          {/* 邮箱输入框 */}
          <div className={styles["input-container"]}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${styles["form-input"]} ${errors.email ? styles["error"] : ""}`}
              placeholder="Email"
            />
            {errors.email && <span className={styles["error-message"]}>{errors.email}</span>}
          </div>

          {/* 密码输入框 */}
          <div className={styles["input-container"]}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${styles["form-input"]} ${errors.password ? styles["error"] : ""}`}
              placeholder="Password"
            />
            <button
              type="button"
              className={styles["toggle-password"]}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles["password-icon"]}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            {errors.password && <span className={styles["error-message"]}>{errors.password}</span>}
          </div>

          {/* 提交按钮 */}
          <button type="submit" className={styles["submit-button"]} disabled={isSubmitting}>
            {isSubmitting ? <div className={styles["loader"]}></div> : "Login"}
          </button>
        </form>

        {/* 底部链接 */}
        <div className={styles["auth-footer"]}>
          <button type="button" className={styles["footer-link"]} onClick={handleForgotPassword}>
            Forgot password?
          </button>
          <button
            type="button"
            className={styles["footer-link"]}
            onClick={handleRegister}
            style={{ marginLeft: "5px" }}
          >
            or Sign up
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth
