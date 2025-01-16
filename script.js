let countdown = 20;
let timer;
let userBet = null;
let betAmount = 0;
let userBalance = 0;
let currentUser = null;


// Hiển thị form đăng ký
function showRegisterForm() {
    document.getElementById("loginContainer").classList.add("hidden");
    document.getElementById("registerContainer").classList.remove("hidden");
  }
  
  // Hiển thị form đăng nhập
  function showLoginForm() {
    document.getElementById("loginContainer").classList.remove("hidden");
    document.getElementById("registerContainer").classList.add("hidden");
  }
  
  // Đăng ký tài khoản
  function register() {
    const username = document.getElementById("registerUsernameInput").value.trim();
    const password = document.getElementById("registerPasswordInput").value.trim();
    
    if (!username || !password) {
      showNotification("Vui lòng nhập tên tài khoản và mật khẩu!");
      return;
    }
  
    const userData = {
      username: username,
      password: password
    };
  
    // Gửi yêu cầu POST lên server để lưu người dùng
    fetch("https://yourserver.com/api/register", { // Thay bằng URL API của bạn
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showNotification("Đăng ký thành công!");
        showLoginForm(); // Quay lại form đăng nhập
      } else {
        showNotification("Đăng ký thất bại. Vui lòng thử lại!");
      }
    })
    .catch(error => {
      showNotification("Lỗi khi kết nối tới server!");
      console.error("Error:", error);
    });
  }
  
  // Đăng nhập
  function login() {
    const username = document.getElementById("usernameInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();
  
    if (!username || !password) {
      showNotification("Vui lòng nhập tên tài khoản và mật khẩu!");
      return;
    }
  
    const userData = {
      username: username,
      password: password
    };
  
    // Gửi yêu cầu POST lên server để kiểm tra đăng nhập
    fetch("https://yourserver.com/api/login", { // Thay bằng URL API của bạn
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        userBalance = data.balance;
        currentUser = username;
        showNotification(`Chào mừng trở lại, ${username}!`);
        document.getElementById("loginContainer").classList.add("hidden");
        document.getElementById("gameContainer").classList.remove("hidden");
        document.getElementById("usernameDisplay").textContent = `Người chơi: ${username}`;
        updateBalance();
        startGame();
      } else {
        showNotification("Tên tài khoản hoặc mật khẩu không đúng!");
      }
    })
    .catch(error => {
      showNotification("Lỗi khi kết nối tới server!");
      console.error("Error:", error);
    });
  }

  
// Hiển thị thông báo
function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.add("show");
  
    // Tắt thông báo sau 2 giây
    setTimeout(() => {
      notification.classList.remove("show");
    }, 2000);
}

// Đăng nhập hoặc tạo tài khoản
function login() {
    const username = document.getElementById("usernameInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();
    
    if (!username || !password) {
      showNotification("Vui lòng nhập tên tài khoản và mật khẩu!");
      return;
    }
  
    currentUser = username;
    const storedData = JSON.parse(localStorage.getItem("users")) || {};
  
    // Kiểm tra xem người dùng đã tồn tại chưa
    if (storedData[username]) {
      // Kiểm tra mật khẩu
      if (storedData[username].password !== password) {
        showNotification("Mật khẩu không đúng!");
        return;
      }
      userBalance = storedData[username].balance;
      showNotification(`Chào mừng trở lại, ${username}!`);
    } else {
      // Nếu tài khoản chưa tồn tại, tạo tài khoản mới
      storedData[username] = { 
        balance: 100000, // Số dư mặc định
        password: password // Lưu mật khẩu
      };
      localStorage.setItem("users", JSON.stringify(storedData));
      userBalance = 100000; // Số dư mặc định
      showNotification(`Tài khoản mới được tạo: ${username}`);
    }
  
    document.getElementById("loginContainer").classList.add("hidden");
    document.getElementById("gameContainer").classList.remove("hidden");
    document.getElementById("usernameDisplay").textContent = `Người chơi: ${username}`;
    updateBalance();
    startGame();
}

// Lưu thông tin người dùng
function saveUserData() {
    const storedData = JSON.parse(localStorage.getItem("users")) || {};
    if (currentUser) {
      storedData[currentUser] = { balance: userBalance, password: storedData[currentUser].password };
      localStorage.setItem("users", JSON.stringify(storedData));
    }
}


// Bắt đầu trò chơi
function startGame() {
  updateBalance();
  resetGame();
  timer = setInterval(() => {
    countdown--;
    document.getElementById("timer").textContent = `Thời gian còn: ${countdown} giây`;
    if (countdown <= 0) {
      rollDice();
      countdown = 20; // Reset thời gian về 20 giây
    }
  }, 1000);
}

// Quay xúc xắc và tính kết quả
function rollDice() {
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  const dice3 = Math.floor(Math.random() * 6) + 1;
  const total = dice1 + dice2 + dice3;

  document.getElementById("dice").textContent = `Kết quả: ${dice1} + ${dice2} + ${dice3} = ${total}`;
  const result = total >= 11 ? "Tài" : "Xỉu";

  if (userBet && betAmount > 0) {
    if (userBet === result) {
      const winAmount = betAmount * 2;
      userBalance += winAmount;
      document.getElementById("result").textContent = `Kết quả: ${result}. Bạn thắng ${winAmount} đồng!`;
    } else {
      userBalance -= betAmount;
      document.getElementById("result").textContent = `Kết quả: ${result}. Bạn thua ${betAmount} đồng!`;
    }
  } else {
    document.getElementById("result").textContent = `Kết quả: ${result}. Bạn chưa đặt cược!`;
  }

  // Cập nhật số dư và reset cược
  updateBalance();
  userBet = null;
  betAmount = 0;
  updateBetDisplay();
}

// Đặt cược Tài hoặc Xỉu
function placeBet(bet) {
  if (betAmount <= 0) {
    document.getElementById("result").textContent = "Bạn chưa đặt số tiền cược!";
    return;
  }

  if (betAmount > userBalance) {
    document.getElementById("result").textContent = "Bạn không đủ tiền để đặt cược!";
    return;
  }

  userBet = bet;
  document.getElementById("result").textContent = `Bạn đã đặt ${bet} với ${betAmount} đồng.`;
}

// Cộng dồn tiền cược
function addBetAmount(amount) {
  if (userBalance - betAmount < amount) {
    document.getElementById("result").textContent = "Bạn không đủ tiền để thêm số tiền này!";
    return;
  }

  betAmount += amount;
  updateBetDisplay();
}

// Cập nhật hiển thị tiền cược
function updateBetDisplay() {
  document.getElementById("currentBet").textContent = `Tiền cược hiện tại: ${betAmount} đồng`;
}

// Cập nhật số dư
function updateBalance() {
  document.getElementById("balance").textContent = `Số dư: ${userBalance} đồng`;
}

// Reset game
function resetGame() {
  countdown = 20;
  document.getElementById("timer").textContent = `Thời gian còn: ${countdown} giây`;
  document.getElementById("result").textContent = "Chờ kết quả...";
  document.getElementById("dice").textContent = "";
}



// Bắt đầu trò chơi ngay khi tải trang
startGame();




  
