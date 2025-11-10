"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import styles from "./styles.module.scss"
import { resetPassword } from "../../../services/auth"
import type { ResetPasswordParams } from "../../../types/request/resetPassword"

interface FormData {
  email: string
  verify_code: string
  new_password: string
  confirm_password: string
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams<{ lang: string }>()
  const [searchParams] = useSearchParams()
  const currentLang = params.lang || 'en'
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [targetTheme, setTargetTheme] = useState<"dark" | "light" | null>(null)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    verify_code: "",
    new_password: "",
    confirm_password: ""
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

  // 从URL查询参数中读取邮箱并填充到表单
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setFormData(prev => ({
        ...prev,
        email: decodeURIComponent(emailParam)
      }))
    }
  }, [searchParams])



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

    if (!formData.verify_code) {
      newErrors.verify_code = "Verification code is required"
    } else if (formData.verify_code.length !== 6 || !/^\d+$/.test(formData.verify_code)) {
      newErrors.verify_code = "Verification code must be 6 digits"
    }

    if (!formData.new_password) {
      newErrors.new_password = "New password is required"
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = "Password must be at least 6 characters"
    }

    if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }



  // 表单提交处理 - 重置密码
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // 构造重置密码参数
      const resetPasswordParams: ResetPasswordParams = {
        email: formData.email,
        verify_code: formData.verify_code,
        new_password: formData.new_password
      }

      // 调用重置密码接口
      const response = await resetPassword(resetPasswordParams)

      if (response.code === 200) {
        console.log("Password reset successfully")
        // 重置成功后跳转到登录页面
        // alert("Password reset successfully! Please login with your new password.")
        navigate(`/${currentLang}/auth/login`)
      } else {
        console.error("Password reset failed", response.message)
        setErrors({ verify_code: response.message || "Password reset failed" })
      }
    } catch (error) {
      console.error("Password reset failed", error)
      setErrors({ verify_code: "An error occurred during password reset" })
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
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
            </svg>
          </div>
        </div>

        <h2 className={styles["form-title"]}>Reset Password</h2>
        <p className={styles["form-description"]}>
            Please enter the verification code sent to your email and your new password.
          </p>

          {/* 显示邮箱地址 */}
          <div className={styles["email-display"]}>
            <span>Verification code sent to: </span>
            <strong>{formData.email}</strong>
          </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className={styles["auth-form"]}>
          {/* 验证码输入框 */}
          <div className={styles["input-container"]}>
            <input
              type="text"
              id="verify_code"
              name="verify_code"
              value={formData.verify_code}
              onChange={handleInputChange}
              placeholder="Verification Code"
              className={`${styles["form-input"]} ${errors.verify_code ? styles["form-input-error"] : ""}`}
              maxLength={6}
            />
            {errors.verify_code && (
              <p className={styles["error-message"]}>{errors.verify_code}</p>
            )}
          </div>

          {/* 新密码输入框 */}
          <div className={styles["input-container"]}>
            <input
              type={showPassword ? "text" : "password"}
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleInputChange}
              placeholder="New Password"
              className={`${styles["form-input"]} ${errors.new_password ? styles["form-input-error"] : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles["toggle-password"]}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
            {errors.new_password && (
              <p className={styles["error-message"]}>{errors.new_password}</p>
            )}
          </div>

          {/* 确认新密码输入框 */}
          <div className={styles["input-container"]}>
            <input
              type={showPassword ? "text" : "password"}
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              placeholder="Confirm New Password"
              className={`${styles["form-input"]} ${errors.confirm_password ? styles["form-input-error"] : ""}`}
            />
            {errors.confirm_password && (
              <p className={styles["error-message"]}>{errors.confirm_password}</p>
            )}
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            className={`${styles["submit-button"]} ${isSubmitting ? styles["submit-button-disabled"] : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* 返回登录 */}
        <div className={styles["footer-links"]}>
          <button
            type="button"
            onClick={handleBackToLogin}
            className={styles["footer-link"]}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
