// JWT认证相关工具函数

export enum AdminType {
  NONE = 'none',
  CINEMA = 'cinema',
  SYSTEM = 'system'
}

export interface User {
  userId: number;
  name: string;
  phone: string;
  email: string;
  adminType: AdminType;
  managedCinemaId?: number;
  registerTime: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// 获取存储的token
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// 存储token
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// 移除token
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// 获取存储的用户信息
export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('解析用户信息失败:', error);
        return null;
      }
    }
  }
  return null;
};

// 存储用户信息
export const setUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// 检查用户是否已登录
export const isAuthenticated = (): boolean => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

// 检查用户是否为管理员
export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.adminType !== AdminType.NONE;
};

// 检查用户是否为系统管理员
export const isSystemAdmin = (): boolean => {
  const user = getUser();
  return user?.adminType === AdminType.SYSTEM;
};

// 检查用户是否为影院管理员
export const isCinemaAdmin = (): boolean => {
  const user = getUser();
  return user?.adminType === AdminType.CINEMA;
};

// 登出
export const logout = (): void => {
  removeToken();
  // 可以在这里添加其他登出逻辑，如重定向到登录页
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// API请求封装，自动添加Authorization header
export const apiRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });

  // 如果返回401，说明token过期或无效，自动登出
  if (response.status === 401) {
    logout();
    throw new Error('认证失败，请重新登录');
  }

  return response;
};

// 验证token有效性
export const validateToken = async (): Promise<boolean> => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    const response = await apiRequest('http://localhost:8080/api/auth/validate', {
      method: 'POST'
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Token验证失败:', error);
    return false;
  }
};

// 登录函数
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone: username, password }),
    credentials: 'include'
  });

  const data = await response.json();

  if (data.success && data.token && data.user) {
    setToken(data.token);
    setUser(data.user);
  }

  return data;
};

// 注册函数
export const register = async (userData: {
  name: string;
  phone: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include'
  });

  return await response.json();
};