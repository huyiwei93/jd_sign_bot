// version v0.0.2
// create by ruicky
// detail url: https://github.com/ruicky/jd_sign_bot

const exec = require('child_process').execSync;
const fs = require('fs');
const rp = require('request-promise');
const download = require('download');

// 公共变量
const KEY = '__jdu=417097231; shshshfpa=c3ac6e6e-1260-4e9a-f94d-8a550e9295df-1592837851; shshshfpb=jmjEdHvIp5Mc3zBLC8fnMEQ%3D%3D; TrackID=1ynmaxOcwPJD7DjLZ4-ChUjzIvKwd8gxiisRLR9Hm5VcGR3FnAfttgdi6-nvuXQmk3FOSwIVCj7DsrcJ2_RdJjznKCNUA6E231t5uJWSSe2LXkMSkEOz4sRqDt-gkIO3p; pinId=PMIOc6NVeuH8-LGaqL7r5A; jcap_dvzw_fp=3A462UjT-pbd9kEFd9syTqi8DnxJfqXBUqp3MjUn1yy7vhtj85uvObRo9BaLErzBRs9uyw==; webp=1; mba_muid=417097231; visitkey=23722258989559864; __wga=1638444974922.1638444974922.1638444974922.1638444974922.1.1; __jda=122270672.417097231.1592837834.1638444897.1641289889.27; __jdv=122270672%7Cdirect%7C-%7Cnone%7C-%7C1641289889119; __jdc=122270672; pt_token=v8la3g4v; pwdt_id=13761562289_p; sfstoken=tk01mdb971d71a8sMiszeDFqK3dw0nzCyDu0MIt+ozC3GUjvuIh5FIsZIAZti2tJtsss7xZrKEBISe4LiHTgfqiwQsQS; wxa_level=1; retina=1; cid=9; jxsid=16412899235053799865; shshshfp=5217ee298949f20f651ca52bc8c22ed9; shshshsID=6ae39ac150eeb105fa70cc4aa9eba584_2_1641290005836; 3AB9D23F7A4B3C9B=3B76EDG42ONXXNQCOBDLNMR6UBAPIE6PBDLUEATDHTJGCA5DVLFRPNQPEBVGQ323H3SHRTPYFG5AGKKEYC64F67M4I; wqmnx1=MDEyNjM1M3BtYzcyODh6LyhuO2VjWDEgZWk3KExrY0NlMDQgcjcycjJmLTJLV1VJIyYoKQ%3D%3D; __jdb=122270672.4.417097231|27.1641289889; mba_sid=16412898891238282328643020198.4; __jd_ref_cls=MSearch_DarkLines';
const serverJ = process.env.PUSH_KEY;
const DualKey = process.env.JD_COOKIE_2;


async function downFile () {
    // const url = 'https://cdn.jsdelivr.net/gh/NobyDa/Script@master/JD-DailyBonus/JD_DailyBonus.js'
    const url = 'https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js';
    await download(url, './');
}

async function changeFile () {
   let content = await fs.readFileSync('./JD_DailyBonus.js', 'utf8')
   content = content.replace(/var Key = ''/, `var Key = '${KEY}'`);

  console.log(KEY, 'key')
   if (DualKey) {
    content = content.replace(/var DualKey = ''/, `var DualKey = '${DualKey}'`);
   }
   await fs.writeFileSync( './JD_DailyBonus.js', content, 'utf8')
}

async function sendNotify (text,desp) {
  const options ={
    uri:  `https://sc.ftqq.com/${serverJ}.send`,
    form: { text, desp },
    json: true,
    method: 'POST'
  }
  await rp.post(options).then(res=>{
    console.log(res)
  }).catch((err)=>{
    console.log(err)
  })
}

async function start() {
  if (!KEY) {
    console.log('请填写 key 后在继续')
    return
  }
  // 下载最新代码
  await downFile();
  console.log('下载代码完毕')
  // 替换变量
  await changeFile();
  console.log('替换变量完毕')
  // 执行
  await exec("node JD_DailyBonus.js >> result.txt");

  const data = fs.readFileSync('result.txt', 'utf8')
  console.log(data, '执行完毕')

  if (serverJ) {
    const path = "./result.txt";
    let content = "";
    if (fs.existsSync(path)) {
      content = fs.readFileSync(path, "utf8");
    }
    let t = content.match(/【签到概览】:((.|\n)*)【签到奖励】/)
    let res = t ? t[1].replace(/\n/,'') : '失败'
    let t2 = content.match(/【签到奖励】:((.|\n)*)【其他奖励】/)
    let res2 = t2 ? t2[1].replace(/\n/,'') : '总计0'

    
    await sendNotify("" + ` ${res2} ` + ` ${res} ` + new Date().toLocaleDateString(), content);
  }
}

start()
