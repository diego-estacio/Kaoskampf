const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:3021/auth/login', {
      login: 'diego@filmelab.com.br', // Using a dummy or common admin username if possible or we can just see if the endpoint works at all
      senha: 'password'
    });
    console.log(res.data);
  } catch (err) {
    console.log(err.response ? err.response.data : err.message);
  }
}
test();
