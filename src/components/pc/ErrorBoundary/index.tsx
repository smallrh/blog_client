import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import Error from '../../../pages/pc/Error';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染显示降级 UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 可以在这里记录错误信息
    console.error('React ErrorBoundary caught an error:', error);
    console.error('Error details:', errorInfo);
    // 可以将错误发送到错误跟踪服务
  }

  // 从路由中获取语言参数
  getLanguage() {
    const location = window.location.pathname;
    const parts = location.split('/');
    const params = {
      lang: parts[1] || 'zh'
    };
    
    // 支持的语言列表
    const supportedLanguages = ['en', 'zh', 'ja', 'ko'];
    return supportedLanguages.includes(params.lang) ? params.lang : 'zh';
  }

  render() {
    if (this.state.hasError) {
      // 为了保持与路由结构一致，我们需要一个带有语言参数的Error组件
      return <Error />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
