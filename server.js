const updatedData = require("./createUser");
const uploadDp = require("./uploadphoto");
const updateUser = require("./update");
const Dotenv = require("dotenv").config();
const axios = require("axios");
const { Bot, session, InlineKeyboard } = require("grammy");
const fs = require("fs");
const { log } = require("console");

const bot = new Bot(process.env.BOT);
const Regex = /^[a-zA-Z][a-zA-Z0-9\s!@#$%^&*()_+{}\[\]:;<>,.?/~`-]*$/;

bot.use(
  session({
    initial: () => ({
      name: null,
      username: null,
      DP: null,
      socialMedia: null,
      form: false,
      NewName: false,
      NewUsername: false,
      NewDP: false,
      NewsocialMedia: false,
      delete: false,
    }),
  })
);

bot.command('cancel',async (ctx)=>{
  ctx.session.name= null,
  ctx.session.username= null,
  ctx.session.DP= null,
  ctx.session.socialMedia= null,
  ctx.session.form= false,
  ctx.session.NewName= false,
  ctx.session.NewUsername= false,
  ctx.session.NewDP= false,
  ctx.session.NewsocialMedia= false,
  ctx.session.delete= false,
 await ctx.reply('Action Terminated')
})

bot.command("start", async (ctx) => {
  FetchData().then(async (data) => {
    if (data.has(ctx.chat.id.toString())) {
      await bot.api.sendMessage(
        ctx.chat.id,
        `<b><i>Hi!</i> <a href="https://ngl-clone-production.up.railway.app/${
          data.get(ctx.chat.id.toString()).username
        }">${
          data.get(ctx.chat.id.toString()).username
        }</a> <i>how you doing!</i></b> .`,
        { parse_mode: "HTML", disable_web_page_preview: true }
      );

      await bot.api.setMyCommands([
        { command: "start", description: "Start bot " },
        { command: "manage", description: "Manage Account" },
        { command: "details", description: "View Account details" },
        { command: "cancel", description: "cancel" },
      ]);
    } else {
      await bot.api.sendMessage(
        ctx.chat.id,
        '<b>Hi!</b> <i>Welcome</i> to <a href="http://ngl-clone-production.up.railway.app">NGL</a>.',
        { parse_mode: "HTML", disable_web_page_preview: true }
      );

      await ctx.reply("Type! /activate to set up your account.");

      await bot.api.setMyCommands([
        { command: "start", description: "Start bot " },
      ]);
    }
  });
});

bot.command("details", async (ctx) => {
  FetchData().then(async (data) => {
    if (data.has(ctx.chat.id.toString())) {
      ctx.reply(
        `
      <b>👤 Name:</b> ${data.get(ctx.chat.id.toString()).name}\n
<b>👥 Username:</b> ${data.get(ctx.chat.id.toString()).username} \n
<b>🔗 Link:</b> ${data.get(ctx.chat.id.toString()).link} \n
<b>🌐 Social Link:</b> ${data.get(ctx.chat.id.toString()).socialLink} \n
<b>🆔 ID:</b> ${data.get(ctx.chat.id.toString()).id}
      `,
        {
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }
      );
    }
  });
});

bot.command("manage", async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()

    .text("Change Username ⚙️", "change_username")
    .row()

    .text("Change Name 📛", "change_name")

    .text("Change Social Link 🔗", "change_social_link")
    .row()

    .text("Change Profile Picture 🖼️", "change_profile_picture");

  // .text('Delete Account ❌', 'delete_account')

  await ctx.reply("Manage Your Account", {
    reply_markup: inlineKeyboard,
  });
});

bot.on("callback_query:data", async (ctx) => {
  if (ctx.callbackQuery.data === "change_username") {
    (ctx.session.NewName = false),
      (ctx.session.NewUsername = false),
      (ctx.session.NewDP = false),
      (ctx.session.NewsocialMedia = false),
      (ctx.session.delete = false),
      (ctx.session.NewUsername = true);
    await ctx.answerCallbackQuery();
    await ctx.reply("Enter your new username: 📛");
  } else if (ctx.callbackQuery.data === "change_name") {
    (ctx.session.NewName = false),
      (ctx.session.NewUsername = false),
      (ctx.session.NewDP = false),
      (ctx.session.NewsocialMedia = false),
      (ctx.session.delete = false),
      (ctx.session.NewName = true);
    await ctx.answerCallbackQuery();
    await ctx.reply("Enter your new name: 📛");
  } else if (ctx.callbackQuery.data === "change_social_link") {
    (ctx.session.NewName = false),
      (ctx.session.NewUsername = false),
      (ctx.session.NewDP = false),
      (ctx.session.NewsocialMedia = false),
      (ctx.session.delete = false),
      (ctx.session.NewsocialMedia = true);
    await ctx.answerCallbackQuery();
    await ctx.reply("Enter your new social link: 🔗");
  } else if (ctx.callbackQuery.data === "change_profile_picture") {
    (ctx.session.NewName = false),
      (ctx.session.NewUsername = false),
      (ctx.session.NewDP = false),
      (ctx.session.NewsocialMedia = false),
      (ctx.session.delete = false),
      (ctx.session.NewDP = true);
    await ctx.answerCallbackQuery();
    await ctx.reply("Send your new profile picture: 🖼️");
  } else if (ctx.callbackQuery.data === "delete_account") {
    (ctx.session.NewName = false),
      (ctx.session.NewUsername = false),
      (ctx.session.NewDP = false),
      (ctx.session.NewsocialMedia = false),
      (ctx.session.delete = false),
      (ctx.session.delete = true);
    await ctx.answerCallbackQuery();
    await ctx.reply("Are you sure you want to delete your account? ❌");
  }
});

bot.command("activate", async (ctx) => {
  ctx.session.form = true;
  Form(ctx.chat.id, 1);
  console.log(
    ctx.session.name,
    ctx.session.username,
    ctx.session.DP,
    ctx.session.socialMedia
  );
});

bot.on("msg:text", async (ctx) => {
  if (ctx.session.form) {
    if (ctx.session.name == null) {
      if (Regex.test(ctx.msg.text) && ctx.msg.text.length > 3) {
        ctx.session.name = ctx.msg.text;
        Form(ctx.chat.id, 2);
        console.log(ctx.session.name);
      } else {
        await ctx.reply(
          "❌ Name must be at least 3 letters long. Please provide a valid name."
        );
      }
    } else if (ctx.session.username == null) {
      if (ctx.msg.text.length > 3 && Regex.test(ctx.msg.text)) {
        FetchUsername().then(async (data) => {
          if (data.has(ctx.msg.text)) {
            await ctx.reply("❌ username already exist.");
          } else {
            ctx.session.username = ctx.msg.text;
            Form(ctx.chat.id, 3);
            console.log(ctx.session.username);
          }
        });
      } else {
        await ctx.reply(
          "❌ username must be at least 3 letters long. Please provide a valid username."
        );
      }
    } else if (ctx.session.Dp == null) {
      await ctx.reply("❌ Please Upload Image.");
    }
  } else if (ctx.session.NewName) {
    if (Regex.test(ctx.msg.text) && ctx.msg.text.length > 3) {
      await updateUser(ctx.chat.id.toString(), "name", ctx.msg.text).then(
        async () => {
          await ctx.reply("Name updated: 📛");
          ctx.session.NewName = false;
        }
      );
    } else {
      await ctx.reply(
        "❌ Name must be at least 3 letters long. Please provide a valid name."
      );
    }
  } else if (ctx.session.NewUsername) {
    if (ctx.msg.text.length > 3 && Regex.test(ctx.msg.text)) {
      FetchUsername().then(async (data) => {
        if (data.has(ctx.msg.text)) {
          await ctx.reply("❌ username already exist.");
        } else {
          await updateUser(
            ctx.chat.id.toString(),
            "username",
            ctx.msg.text
          ).then(async () => {
            await updateUser(
              ctx.chat.id.toString(),
              "link",
              `https://ngl-clone-production.up.railway.app/${ctx.msg.text}`
            ).then(async () => {
              await ctx.reply("Username updated: 📛");
              ctx.session.NewUsername = false;
            });
          });
        }
      });
    } else {
      await ctx.reply(
        "❌ username must be at least 3 letters long. Please provide a valid username."
      );
    }
  } else if (ctx.session.NewDP) {
    await ctx.reply("❌ Please Upload Image.");
  } else if (ctx.session.delete) {
    if (ctx.msg.text.toLowerCase() == "yes") {
    } else if (ctx.msg.text.toLowerCase() == "no") {
      await ctx.reply("You cancelled Account Deletion: 📛");
    }
  } else if (ctx.session.NewsocialMedia) {
    const containsUrl = /https?:\/\/\S+/i.test(ctx.msg.text);
    if (containsUrl && ctx.session.NewsocialMedia) {
      updateUser(ctx.chat.id.toString(), "socialLink", ctx.msg.text).then(
        async () => {
          await ctx.reply("Social link updated: 🔗");
          ctx.session.NewsocialMedia = false;
        }
      );
    } else {
      await ctx.reply("❌ invalid link 🔗");
    }
  }
});

bot.on("message:photo",async(ctx)=>{
  if(ctx.session.form){
    const file = await ctx.getFile()
    const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT}/${file.file_path}`
    axios({method:'get',url:fileUrl,responseType: 'stream'})
    .then(response=>{
        response.data.pipe(fs.createWriteStream(file.file_path))
        response.data.on('end',async()=>{
          await uploadDp(file.file_path).then(async()=>{
            fs.unlinkSync(file.file_path)
            await bot.api.setMyCommands([
              { command: "start", description: "Start bot " },
              { command: "manage", description: "Manage Account" },
              { command: "details", description: "View Account details" },
              { command: "cancel", description: "cancel" },
            ]);
            const replyMessage = `
        <strong>✅ Account created successfully!</strong>\n\n
        👤 <strong>Name:</strong> ${ctx.session.name}\n\n
        👥 <strong>Username:</strong> ${ctx.session.username}\n\n
        🔗 <strong>Link:</strong> "https://ngl-clone-production.up.railway.app/${ctx.session.username}"\n\n
        🌐 <strong>Social Link:</strong> ${ctx.session.socialLink}\n\n
        🆔 <strong>ID:</strong> ${ctx.chat.id}\n\n
        🚀 <strong>START @NglTelgramBot to Activate your account</strong>\n\n
    `;

    ctx.reply(replyMessage, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
    });
            


          })
        })
      }
      )
    }

    if(ctx.session.NewDP){
      const file = await ctx.getFile()
      const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT}/${file.file_path}`
      axios({method:'get',url:fileUrl,responseType: 'stream'})
      .then(response=>{
          response.data.pipe(fs.createWriteStream(file.file_path))
          response.data.on('end',async()=>{
            await uploadDp(file.file_path).then(async()=>{
              updateUser((ctx.chat.id).toString(),'dp',`https://happy-music.vercel.app/Cover/${file.file_path.split('/').pop()}`).then(async()=>{
                fs.unlinkSync(file.file_path)
                await ctx.reply("📷 Profile photo updated:");
              })    
            })
          })
        }
        )
    }

})

bot.catch((err) => {
  console.log(err);
});

function Form(id, no) {
  let ChatID = id;
  let Question = no;

  switch (Question) {
    case 1:
      bot.api.sendMessage(ChatID, "👋 Please enter your name:");

      break;
    case 2:
      bot.api.sendMessage(ChatID, "🤖 Please enter your username:");
      break;
    case 3:
      bot.api.sendMessage(ChatID, "📷 Please send a photo:");

      break;

    default:
      break;
  }
}

async function FetchData() {
  try {
    const accessToken = process.env.GITHUB_TOKEN;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(
      "https://api.github.com/repos/babyo7/NGl--Database/contents/data.json",
      { headers }
    );

    const content = response.data.content;
    const decode = Buffer.from(content, "base64").toString("utf-8");
    const data = JSON.parse(decode);

    let userData = new Map(data.map((item) => [item.id, item]));
    return userData;
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

async function FetchUsername() {
  try {
    const accessToken = process.env.GITHUB_TOKEN;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(
      "https://api.github.com/repos/babyo7/NGl--Database/contents/data.json",
      { headers }
    );

    const content = response.data.content;
    const decode = Buffer.from(content, "base64").toString("utf-8");
    const data = JSON.parse(decode);

    let userData = new Map(data.map((item) => [item.username, item]));
    return userData;
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

bot.start();

console.log("bot running")
