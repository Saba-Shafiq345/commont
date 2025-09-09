
const el = {
  wrap: document.getElementById("comments"),
  send: document.getElementById("sendBtn"),
  newInput: document.getElementById("newComment"),
};

let state = {
  currentUser: {
    username: "me",
    image: "https://i.pravatar.cc/40"
  },
  comments: [
    {
      id: 1,
      user: "Eman",
      content: "This is Amy’s first comment",
      createdAt: "1 month ago",
      score: 5,
      replies: []
    },
    {
      id: 2,
      user: "Saba",
      content: "Max is replying here!",
      createdAt: "2 weeks ago",
      score: 2,
      replies: []
    },
    {
      id: 3,
      user: "Sania",
      content: "Max is replying here!",
      createdAt: "3weeks ago",
      score: 2,
      replies: []
    }
  ]

};

// count all replies
function countReplies(c) {
  let total = c.replies.length;
  c.replies.forEach(r => total += countReplies(r));
  return total;
}

// render
function render() {
  el.wrap.innerHTML = "";
  state.comments.sort((a, b) => b.score - a.score).forEach(c => {
    el.wrap.appendChild(CommentCard(c, state.comments));
  });
}

function CommentCard(c, list) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
        <div class="header">
          <img class="avatar" src="https://i.pravatar.cc/40?u=${c.user}">
          <span class="username">${c.user}</span>
          <span class="time">${c.createdAt}</span>
          <div class="actions">
          
  ${c.user === state.currentUser.username
    ? `<button class="edit">Edit</button><button class="delete">Delete</button>`
    : ""}
  <button class="reply">Reply</button>
</div>
        </div>
        <p class="text">${c.content}</p>
        <div class="vote">
          <button class="plus">+</button>
          <span>${c.score}</span>
          <button class="minus">-</button>
          <span>${countReplies(c)} replies</span>
        </div>
        <div class="replies"></div>
       
      `;

//  vote
  card.querySelector(".plus").onclick = () => {
     c.score++; render();
     };
  card.querySelector(".minus").onclick = () => {
     if (c.score > 0) c.score--; render(); 
    };



  // edit
  const edit = card.querySelector(".edit");
  if (edit) {
    edit.onclick = () => {
      const text = card.querySelector(".text");
      const ta = document.createElement("textarea");
      ta.value = c.content;
      text.replaceWith(ta);
      const update = document.createElement("button");
      update.textContent = "Update";
      card.appendChild(update);
      update.onclick = () => {
        c.content = ta.value;
        render();
      };
    };
  }

  // delete
  const del = card.querySelector(".delete");
  if (del) {
    del.onclick = () => {
      if (confirm("Delete this comment?")) {
        const idx = list.indexOf(c);
        list.splice(idx, 1);
        render();
      }
    };
  }

  // reply
  const replyBtn = card.querySelector(".reply");
  if (replyBtn) {
    replyBtn.onclick = () => {

      if (card.querySelector(".composer")) return;

      const box = document.createElement("div");
      box.className = "composer";
      box.innerHTML = `
          <textarea>@${c.user} hi</textarea>
          <button class="btn primary">Send</button>
        `;
      card.appendChild(box);

      const btn = box.querySelector("button");
      const ta = box.querySelector("textarea");
      btn.onclick = () => {
        c.replies.push({
          id: Date.now(),
          user: state.currentUser.username,
          content: ta.value,
          createdAt: "Just now",
          score: 0,
          replies: []
        });
        render();
      };
    };
  }
 
const replyWrap = card.querySelector(".replies");
c.replies
  .sort((a, b) => b.score - a.score) 
  .forEach(r => {
    replyWrap.appendChild(CommentCard(r, c.replies));
  });
  return card;

}



// new comment
el.send.onclick = () => {
  const txt = el.newInput.value.trim();
  if (!txt) return;
  state.comments.push({
    id: Date.now(),
    user: state.currentUser.username,
    content: txt,
    createdAt: "Just now",
    score: 0,
    replies: []
  });
  el.newInput.value = "";
  render();
};


render();