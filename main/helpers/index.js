
const mb = (...p) => o => p.map(c => o = (o || {})[c]) && o
const mb_ip = mb('headers', 'x-forwarded-for')
const mb_ip_cf = mb('headers', 'cf-connecting-ip')


const getIp = (request) => {
  let ip = mb_ip(request)
  ip = (ip || '').toString().split(',')[0] || mb_ip_cf(request)
  return ip
}

const clean_object = n => JSON.parse(JSON.stringify(n))

const checkParams = (props, body) => {
  return props.reduce(function (i, j) { return i && j in body }, true);
}


const isEmail = (emaill) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(emaill);
}

const toString = (id = "") => {
  return `${id}`;
}

function sleep(ms) {
  return new Promise(p => setTimeout(p, ms))
}


module.exports = {
  getIp,
  checkParams,
  isEmail,
  toString,
  sleep
}
