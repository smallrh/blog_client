"use client"

import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { login } from "../../../services/auth"
import { useTheme } from "../../../hooks/useTheme"
import styles from "./styles.module.scss"

// 登录参数接口
interface LoginParams {
  account: string;
  password: string;
}

interface FormData {
  email: string
  password: string
}

const Auth: React.FC = () => {
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // 使用useTheme钩子后不需要手动管理主题状态
  useEffect(() => {
    // 主题管理已由useTheme钩子处理
    return () => {
      // 清理函数
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
      // 调用登录接口
      const loginParams: LoginParams = {
        account: formData.email, // 使用email作为account
        password: formData.password
      }
      
      const response = await login(loginParams)
      
      if (response.code === 200) {
        console.log("登录成功", response.data)
        // 登录成功后重定向到首页
        navigate("/")
      } else {
        // 显示错误信息
        setErrors({ password: response.message || "登录失败，请检查账号和密码" })
      }
    } catch (error) {
      console.error("登录失败", error)
      setErrors({ password: "后端接口报错，请稍后重试" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 处理忘记密码
  const handleForgotPassword = () => {
    console.log("Forgot password clicked")
    // 使用导航跳转到忘记密码页面
    navigate("/auth/forgot-password")
  }

  // 处理注册
  const handleRegister = () => {
    console.log("Register clicked")
    // 使用导航跳转到注册页面
    navigate("/auth/register")
  }

  const handleThemeToggle = () => {
    // 如果动画正在进行中，不执行任何操作
    if (isAnimating) return;

    setIsAnimating(true)

    // 使用toggleTheme方法切换主题
    setTimeout(() => {
      toggleTheme()
    }, 400)

    // 动画结束后重置状态
    setTimeout(() => {
      setIsAnimating(false)
    }, 1000)
  }

  const themeClass = isDarkMode ? styles["dark-mode"] : styles["light-mode"]
  const overlayClass = ""

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
