// @ts-ignore
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase || 'https://spsn-backend.onrender.com'

  const getAdminToken = () => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )admin_token=([^;]+)'));
    if (!match || !match[2]) return null;
    let token = decodeURIComponent(match[2]);
    // Nuxt's useCookie JSON-serializes strings, wrapping them in quotes
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }
    return token;
  };

  const call = async (endpoint: string, options: any = {}) => {
    try {
      const token = getAdminToken();
      const headers: any = { ...options.headers };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await $fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers
      })
      return { data: response, error: null }
    } catch (err: any) {
      return { data: null, error: err.data || 'Something went wrong' }
    }
  }

  const download = (endpoint: string, filename: string) => {
    const link = document.createElement('a');
    link.href = `${baseUrl}${endpoint}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const downloadCSV = (headers: string[], filename: string) => {
    const content = headers.join(',') + '\n';
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return {
    members: {
      getAll: () => call('/members'),
      getOne: (id: string) => call(`/members/${id}`),
      update: (id: string, data: any) => call(`/members/${id}`, { method: 'PATCH', body: data }),
      delete: (id: string) => call(`/members/${id}`, { method: 'DELETE' }),
      import: (formData: FormData) => call('/members/import', { method: 'POST', body: formData }),
      export: () => download('/members/export', 'members.xlsx'),
      downloadTemplate: () => downloadCSV(['Full Name', 'Email', 'Phone Number', 'Membership ID', 'Role', 'Status', 'Category', 'Organization', 'Expiry Date'], 'members_template.csv'),
    },
    blogs: {
      getAll: () => call('/blogs'),
      create: (data: any) => call('/blogs', { method: 'POST', body: data }),
      update: (id: string, data: any) => call(`/blogs/${id}`, { method: 'PATCH', body: data }),
      delete: (id: string) => call(`/blogs/${id}`, { method: 'DELETE' }),
      import: (formData: FormData) => call('/blogs/import', { method: 'POST', body: formData }),
      export: () => download('/blogs/export', 'blogs.xlsx'),
      downloadTemplate: () => downloadCSV(['Title', 'Content', 'Author', 'Category', 'Status', 'Image'], 'blogs_template.csv'),
    },
    appointments: {
      getAll: () => call('/appointments'),
      update: (id: string, data: any) => call(`/appointments/${id}`, { method: 'PATCH', body: data }),
      import: (formData: FormData) => call('/appointments/import', { method: 'POST', body: formData }),
      export: () => download('/appointments/export', 'appointments.xlsx'),
      downloadTemplate: () => downloadCSV(['Member', 'Date', 'Time', 'Purpose', 'Status', 'Notes'], 'appointments_template.csv'),
    },
    conferences: {
      getAll: () => call('/conferences'),
      create: (data: any) => call('/conferences', { method: 'POST', body: data }),
      update: (id: string, data: any) => call(`/conferences/${id}`, { method: 'PATCH', body: data }),
      delete: (id: string) => call(`/conferences/${id}`, { method: 'DELETE' }),
      import: (formData: FormData) => call('/conferences/import', { method: 'POST', body: formData }),
      export: () => download('/conferences/export', 'conferences.xlsx'),
      downloadTemplate: () => downloadCSV(['Title', 'Description', 'Start Date', 'End Date', 'Location', 'Image', 'Is Active'], 'conferences_template.csv'),
    },
    enquiries: {
      getAll: () => call('/enquiries'),
      update: (id: string, data: any) => call(`/enquiries/${id}`, { method: 'PATCH', body: data }),
      import: (formData: FormData) => call('/enquiries/import', { method: 'POST', body: formData }),
      export: () => download('/enquiries/export', 'enquiries.xlsx'),
      downloadTemplate: () => downloadCSV(['Name', 'Email', 'Subject', 'Message', 'Status'], 'enquiries_template.csv'),
    },
    abstracts: {
      getAll: () => call('/abstracts'),
      update: (id: string, data: any) => call(`/abstracts/${id}`, { method: 'PATCH', body: data }),
      import: (formData: FormData) => call('/abstracts/import', { method: 'POST', body: formData }),
      export: () => download('/abstracts/export', 'abstracts.xlsx'),
      downloadTemplate: () => downloadCSV(['Title', 'Author', 'Content', 'Category', 'Conference', 'Email', 'Phone Number', 'Status'], 'abstracts_template.csv'),
    },
    payments: {
      getAll: () => call('/payments'),
      import: (formData: FormData) => call('/payments/import', { method: 'POST', body: formData }),
      export: () => download('/payments/export', 'payments.xlsx'),
      downloadTemplate: () => downloadCSV(['Amount', 'Reference', 'Status', 'Payment Method', 'Member'], 'payments_template.csv'),
      approve: (id: string) => call(`/payments/${id}/approve`, { method: 'PATCH' }),
      reject: (id: string, reason: string) => call(`/payments/${id}/reject`, { method: 'PATCH', body: { reason } }),
    },
    forms: {
      getAll: () => call('/forms'),
      create: (data: any) => call('/forms', { method: 'POST', body: data }),
      update: (id: string, data: any) => call(`/forms/${id}`, { method: 'PATCH', body: data }),
      delete: (id: string) => call(`/forms/${id}`, { method: 'DELETE' }),
      exportResponses: (id: string) => download(`/forms/${id}/export`, `form_responses_${id}.xlsx`),
    },
    cms: {
      getConfig: () => call('/cms'),
      updateConfig: (data: any) => call('/cms', { method: 'PATCH', body: data }),
    },
    upload: {
      image: (formData: FormData) => call('/media/upload', { method: 'POST', body: formData }),
    },
    campaigns: {
      broadcast: (payload: { type: string; data: any }) => call('/campaigns/broadcast', { method: 'POST', body: payload })
    },
    excos: {
      getAll: () => call('/excos'),
      create: (data: any) => call('/excos', { method: 'POST', body: data }),
      update: (id: string, data: any) => call(`/excos/${id}`, { method: 'PATCH', body: data }),
      delete: (id: string) => call(`/excos/${id}`, { method: 'DELETE' }),
    },
    admins: {
      getAll: () => call('/admins'),
      create: (data: any) => call('/admins', { method: 'POST', body: data }),
      update: (id: string, data: any) => call(`/admins/${id}`, { method: 'PATCH', body: data }),
      delete: (id: string) => call(`/admins/${id}`, { method: 'DELETE' }),
    }
  }
}
