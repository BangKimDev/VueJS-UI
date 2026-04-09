import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = reactive({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    phone: '0987654321'
  });

  function updateProfile(newData: { name: string; email: string; phone: string }) {
    user.name = newData.name;
    user.email = newData.email;
    user.phone = newData.phone;
  }

  return {
    user,
    updateProfile
  };
});
