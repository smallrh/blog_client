"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { sendVerificationCode } from "../../../services/auth"
import type { SendCodeParams } from "../../../types/user"
import styles from "./styles.module.scss"

interface FormData {
  email: string
}

const ForgetPass: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams<{ lang: string }>()
  const currentLang = params.lang || 'en'
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [targetTheme, setTargetTheme] = useState<"dark" | "light" | null>(null)
  const [formData, setFormData] = useState<FormData>({
    email: "",
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
      // 调用发送验证码接口
      const sendCodeParams: SendCodeParams = {
        email: formData.email,
        type: 'reset_password'
      }

      const response = await sendVerificationCode(sendCodeParams)
      
      if (response.code === 200) {
        console.log("密码重置验证码已发送到", formData.email)
        setSuccessMessage("Password reset instructions have been sent to your email.")
        
        // 5秒后返回登录页面
        setTimeout(() => {
          navigate(`/${currentLang}/auth/login`)
        }, 5000)
      } else {
        // 显示错误信息
        setErrors({ email: response.message || "发送密码重置邮件失败" })
      }
    } catch (error) {
      console.error("发送密码重置邮件失败", error)
      setErrors({ email: "后端接口报错，请稍后重试" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 返回登录页面
  const handleBackToLogin = () => {
    navigate(`/${currentLang}/auth/login`)
  }

  const handleThemeToggle = () => {
    // 如果动画正在进行中，不执行任何操作
    if (isAnimating) return;

    // 计算目标主题
    const newTheme = isDarkMode ? "light" : "dark"

    // 立即设置目标主题和动画状态
    setTargetTheme(newTheme)
    setIsAnimating(true)

    // 在扩散动画进行到一半时切换实际背景
    setTimeout(() => {
      setIsDarkMode(newTheme === "dark")
      localStorage.setItem("theme", newTheme)
    }, 400)

    // 动画结束后重置状态
    setTimeout(() => {
      setIsAnimating(false)
      setTargetTheme(null)
    }, 1000)
  }

  const themeClass = isDarkMode ? styles["dark-mode"] : styles["light-mode"]
  const overlayClass = targetTheme === "dark" ? styles["to-dark"] : targetTheme === "light" ? styles["to-light"] : ""

  return (
    <div className={`${styles["auth-container"]} ${themeClass}`}>
      <div className={`${styles["theme-transition-overlay"]} ${isAnimating ? styles["active"] : ""} ${overlayClass}`} />

      {/* 主题切换按钮 - 屏幕右下角 */}
      <button
        className={styles["theme-toggle-button"]}
        onClick={handleThemeToggle}
        disabled={isAnimating}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        aria-busy={isAnimating}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      <div className={styles["auth-card"]}>
        {/* 用户图标 - 修改为邮箱图标 */}
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
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
        </div>

        {/* 成功消息 */}
        {successMessage && (
          <div className={styles["success-message"]}>
            {successMessage}
          </div>
        )}

        {/* 表单 */}
        {!successMessage && (
          <form onSubmit={handleSubmit} className={styles["auth-form"]}>
            <div className={styles["form-description"]}>
              Enter your email address and we'll send you instructions to reset your password.
            </div>

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

            {/* 提交按钮 */}
            <button type="submit" className={styles["submit-button"]} disabled={isSubmitting}>
              {isSubmitting ? <div className={styles["loader"]}></div> : "Send Reset Link"}
            </button>
          </form>
        )}

        {/* 底部链接 */}
        <div className={styles["auth-footer"]}>
          <button type="button" className={styles["footer-link"]} onClick={handleBackToLogin}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgetPass