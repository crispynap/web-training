/**********************************/
//아이디 칸이 변경될 경우
//아이디 검사
$('#inputId').keyup(() => {
	Promise.all([idDuplicateCheck(), idStringCheck()])
		.then(() => {
			$('#inputIdText').text('사용해도 좋은 아이디입니다.')
				.css('color', 'green');
		})
		.catch(err => {
			if (err === 'same id found') {
				$('#inputIdText').text('동일한 아이디가 존재합니다.')
					.css('color', 'crimson');
			} else if (err === 'wrong id') {
				$('#inputIdText').text('영문자, 숫자, _ 만 입력 가능.')
					.css('color', 'crimson');
			} else if (err === 'long id') {
				$('#inputIdText').text('20자 이하로 입력하세요.')
					.css('color', 'crimson');
			} else if (err === 'short id') {
				$('#inputIdText').text('3자 이상 입력하세요.')
					.css('color', 'crimson');
			} else {
				$('#inputIdText').text('서버 오류. 관리자에게 문의하세요.')
					.css('color', 'crimson');
			}
		})
})
/**********************************/
//비밀번호 칸이 변경될 경우
//비밀번호가 6자 이상인지 체크
$('#inputPassword').keyup(() => {
	var pwd = $("#inputPassword").val();
	if (pwd.length < 6 && pwd !== "") {
		$('#inputPasswordText').text('최소 6자 이상 입력하세요.');
		$('#inputPasswordText').css('color', 'crimson');
	} else {
		$('#inputPasswordText').text('');
	}
})
/**********************************/
//비밀번호, 비밀번호 확인 칸이 변경될 경우
//비밀번호가 비밀번호 확인과 같은지 체크
$('#inputPassword, #inputPasswordCheck').keyup(() => {
	var pwd = $("#inputPassword").val();
	var pwdChk = $("#inputPasswordCheck").val();
	if (pwdChk) { //비밀번호 확인란이 비워져 있을 경우 대비
		if (pwd !== pwdChk) {
			$('#inputPasswordCheckText').text("비밀번호가 일치하지 않습니다.").css('color', 'crimson');
		} else {
			$('#inputPasswordCheckText').text("비밀번호가 일치합니다.")
				.css('color', 'green');
		}
	}
})
/**********************************/
//별명 칸이 변경될 경우
//별명 중복 검사
$('#inputNickname').keyup(() => {
	nickDuplicateCheck()
		.then(() => {
			$('#inputNicknameText').text('사용해도 좋은 별명입니다.')
				.css('color', 'green');
		})
		.catch(err => {
			if (err === 'same nick found') {
				$('#inputNicknameText').text('동일한 별명이 존재합니다.')
					.css('color', 'crimson');
			} else if (err === 'insert nick') {
				$('#inputNicknameText').text('별명을 입력해주십시오.')
					.css('color', 'crimson');
			} else {
				$('#inputNicknameText').text('서버 오류. 관리자에게 문의하세요.')
					.css('color', 'crimson');
				console.log(err);
			}
		})
})
/**********************************/
//이메일 칸이 변경될 경우
//이메일 주소가 유효한지 체크
$('#inputEmail').change(() => {
	var Email = $("#inputEmail").val();
	if (!Email.match(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/)) {
		$('#inputEmailText').text("이메일 주소가 올바르지 않습니다.").css('color', 'crimson');
	} else {
		$('#inputEmailText').text("");
	}
})
/**********************************/
//회원가입 버튼을 눌렀을 경우
//조건을 전부 검사해서 문제 있는 조건 입력칸으로 이동
$('#reg_button').click(() => {
	Promise.all([idDuplicateCheck(), idStringCheck(), nickDuplicateCheck()])
		.then(() => {
			var pwd = $("#inputPassword").val();
			var pwdChk = $("#inputPasswordCheck").val();
			var Email = $("#inputEmail").val();
			if (pwd.length < 6) {
				throw 'short pwd'
			}
			if (pwd !== pwdChk) {
				throw 'wrong pwd'
			}
			if (!Email.match(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/)) {
				throw 'wrong Email'
			}
			$('#registerForm').submit();
		})
		.catch(err => {
			console.log(err)
			if (err === 'wrong id' || err === 'same id found' || err === 'short id' || err === 'long id') {
				$("#inputId").focus();
			} else if (err === 'short pwd') {
				$("#inputPassword").focus();
			} else if (err === 'wrong pwd') {
				$("#inputPasswordCheck").focus().select();
			} else if (err === 'same nick found' || err === 'insert nick') {
				$("#inputNickname").focus();
			} else if (err === 'wrong Email') {
				$("#inputEmail").focus();
			}
		})
})
/**********************************/
//id 중복 여부 검사
var idDuplicateCheck = () => {
	return new Promise((resolve, reject) => {
		var userId = $("#inputId").val();
		$.ajax({
			url: '/auth/register/idcheck',
			type: 'post',
			dataType: 'text',
			error: (request, status, error) => {
				reject(error);
			},
			data: "data=" + userId,
			success: (data) => {
				if (data == 'found') {
					reject('same id found');
				} else {
					resolve();
				}
			}
		})
	});
}
/**********************************/
//id가 너무 짧거나, 길거나, 지정된 문자 이외의 문자가 들어가는 지 검사
var idStringCheck = () => {
	return new Promise((resolve, reject) => {
		var userId = $("#inputId").val();
		var err = userId.match(/[^A-Za-z0-9_]/);
		if (err) {
			reject('wrong id');
		}
		if (userId.length < 3) {
			reject('short id');
		} else if (userId.length > 19) {
			reject('long id');
		} else {
			resolve();
		}
	});
}
/**********************************/
//별명 중복 여부 검사
var nickDuplicateCheck = () => {
	return new Promise((resolve, reject) => {
		nick = $("#inputNickname").val();
		if (nick == "") {
			reject('insert nick');
		}
		$.ajax({
			url: '/auth/register/nickcheck',
			type: 'post',
			dataType: 'text',
			error: (request, status, error) => {
				reject(error);
			},
			data: "data=" + nick,
			success: (data) => {
				if (data == 'found') {
					reject('same nick found');
				} else {
					resolve();
				}
			}
		})
	});
}