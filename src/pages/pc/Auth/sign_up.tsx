"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { register, sendVerificationCode } from "../../../services/auth"
import type { RegisterParams, SendCodeParams } from "../../../types/user"
import styles from "./styles.module.scss"

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  verifyCode: string
}

const SignUp: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams<{ lang: string }>()
  const currentLang = params.lang || 'en'
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [targetTheme, setTargetTheme] = useState<"dark" | "light" | null>(null)
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    verifyCode: ""
  })
  const [countdown, setCountdown] = useState(0)
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

    if (!formData.username) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.verifyCode) {
      newErrors.verifyCode = "Verification code is required"
    } else if (formData.verifyCode.length !== 6 || !/^\d+$/.test(formData.verifyCode)) {
      newErrors.verifyCode = "Please enter a valid 6-digit verification code"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 发送验证码
  const handleSendCode = async () => {
    // 验证邮箱格式
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: "Please enter a valid email address" })
      return
    }

    try {
      const sendCodeParams: SendCodeParams = {
        email: formData.email,
        type: 'register'
      }

      const response = await sendVerificationCode(sendCodeParams)
      
      if (response.code === 200) {
        // 开始倒计时
        setCountdown(60)
        console.log("验证码已发送")
      } else {
        setErrors({ email: response.message || "发送验证码失败" })
      }
    } catch (error) {
      console.error("发送验证码失败", error)
      setErrors({ email: "后端接口报错，请稍后重试" })
    }
  }

  // 倒计时效果
  useEffect(() => {
    let timer: number
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown])

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // 调用注册接口
      const registerParams: RegisterParams = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        verify_code: formData.verifyCode
      }

      const response = await register(registerParams)
      
      if (response.code === 200) {
        console.log("注册成功", response.data)
        // 注册成功后重定向到首页
        navigate("/")
      } else {
        // 显示错误信息
        setErrors({ username: response.message || "注册失败，请重试" })
      }
    } catch (error) {
      console.error("注册失败", error)
      setErrors({ username: "后端接口报错，请稍后重试" })
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
        {/* 用户图标 - 使用用户加号图标表示注册 */}
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
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="8" y1="15" x2="16" y2="15"></line>
            </svg>
          </div>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className={styles["auth-form"]}>
          {/* 用户名输入框 */}
          <div className={styles["input-container"]}>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`${styles["form-input"]} ${errors.username ? styles["error"] : ""}`}
              placeholder="Username"
            />
            {errors.username && <span className={styles["error-message"]}>{errors.username}</span>}
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
            {errors.password && <span className={styles["error-message"]}>{errors.password}</span>}
          </div>

          {/* 确认密码输入框 */}
          <div className={styles["input-container"]}>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`${styles["form-input"]} ${errors.confirmPassword ? styles["error"] : ""}`}
              placeholder="Confirm Password"
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
            {errors.confirmPassword && <span className={styles["error-message"]}>{errors.confirmPassword}</span>}
          </div>

          {/* 验证码输入框 */}
          <div className={styles["input-container"]}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="text"
                id="verifyCode"
                name="verifyCode"
                value={formData.verifyCode}
                onChange={handleInputChange}
                className={`${styles["form-input"]} ${errors.verifyCode ? styles["error"] : ""}`}
                placeholder="Verification Code"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={countdown > 0 || isSubmitting}
                className={`${styles["submit-button"]} ${countdown > 0 ? styles["disabled"] : ""}`}
                style={{ minWidth: '120px', padding: '10px' }}
              >
                {countdown > 0 ? `${countdown}s` : 'Send Code'}
              </button>
            </div>
            {errors.verifyCode && <span className={styles["error-message"]}>{errors.verifyCode}</span>}
            {errors.email && <span className={styles["error-message"]}>{errors.email}</span>}
          </div>

          {/* 提交按钮 */}
          <button type="submit" className={styles["submit-button"]} disabled={isSubmitting}>
            {isSubmitting ? <div className={styles["loader"]}></div> : "Sign Up"}
          </button>
        </form>

        {/* 底部链接 */}
        <div className={styles["auth-footer"]}>
          <span>Already have an account?</span>
          <button type="button" className={styles["footer-link"]} onClick={handleBackToLogin} style={{ marginLeft: "5px" }}>
            Log in
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignUp