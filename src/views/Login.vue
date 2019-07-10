<template>
  <div class="container">
    <!-- Outer Row -->
    <div class="row justify-content-center">
      <div class="col-xl-10 col-lg-12 col-md-9">
        <div class="card o-hidden border-0 shadow-lg my-5">
          <div class="card-body p-0">
            <!-- Nested Row within Card Body -->
            <div class="row">
              <div class="col-lg-6 d-none d-lg-block bg-login-image">
                  
              </div>
              <div class="col-lg-6">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
                  </div>
                  <form class="user">
                    <div class="form-group">
                      <input
                        v-model="email"
                        type="email"
                        class="form-control form-control-user"
                        id="exampleInputEmail"
                        aria-describedby="emailHelp"
                        placeholder="Enter Email Address..."
                      />
                    </div>
                    <div class="form-group">
                      <input
                        v-model="password"
                        type="password"
                        class="form-control form-control-user"
                        id="exampleInputPassword"
                        placeholder="Password"
                      />
                    </div>
                    <div class="form-group">
                      <div class="custom-control custom-checkbox small">
                        <input type="checkbox" class="custom-control-input" id="customCheck" />
                        <label class="custom-control-label" for="customCheck">Remember Me</label>
                      </div>
                    </div>
                    <a
                      @click="login"
                      class="btn btn-primary btn-user btn-block"
                      style="color:white;"
                    >Login</a>
                    <hr />
                    <a href="index.html" class="btn btn-google btn-user btn-block">
                      <i class="fab fa-google fa-fw"></i> Login with Google
                    </a>
                    <a href="index.html" class="btn btn-facebook btn-user btn-block">
                      <i class="fab fa-facebook-f fa-fw"></i> Login with Facebook
                    </a>
                  </form>
                  <hr />
                  <div class="text-center">
                    <a class="small" href="forgot-password.html">Forgot Password?</a>
                  </div>
                  <div class="text-center">
                    <a class="small" href="register.html">Create an Account!</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import firebase from 'firebase';
  export default {
    name: 'login',
    data() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      login() {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((user) => {
          this.$router.replace('home');
        }).catch((err) => {
          alert('Oops. ' + err.message)
        });
      },
      socialLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result) => {
          this.$router.replace('home');
        }).catch((err) => {
          alert('Oops. ' + err.message)
        });
      }
    }
  }
</script>
<style>
.bg-login-image {
  /* background: url("https://source.unsplash.com/K4mSJ7kc0As/600x800"); */
  background: url("http://lorempixel.com/600/800");
  background-position: center;
  background-size: cover;
}

.btn-google {
  color: #fff;
  background-color: #ea4335;
  border-color: #fff;
}

.btn-google:hover {
  color: #fff;
  background-color: #e12717;
  border-color: #e6e6e6;
}

.btn-google:focus, .btn-google.focus {
  -webkit-box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.5);
}

.btn-google.disabled, .btn-google:disabled {
  color: #fff;
  background-color: #ea4335;
  border-color: #fff;
}

.btn-google:not(:disabled):not(.disabled):active, .btn-google:not(:disabled):not(.disabled).active,
.show > .btn-google.dropdown-toggle {
  color: #fff;
  background-color: #d62516;
  border-color: #dfdfdf;
}

.btn-google:not(:disabled):not(.disabled):active:focus, .btn-google:not(:disabled):not(.disabled).active:focus,
.show > .btn-google.dropdown-toggle:focus {
  -webkit-box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.5);
}

.btn-facebook {
  color: #fff;
  background-color: #3b5998;
  border-color: #fff;
}

.btn-facebook:hover {
  color: #fff;
  background-color: #30497c;
  border-color: #e6e6e6;
}

.btn-facebook:focus, .btn-facebook.focus {
  -webkit-box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.5);
}

.btn-facebook.disabled, .btn-facebook:disabled {
  color: #fff;
  background-color: #3b5998;
  border-color: #fff;
}

.btn-facebook:not(:disabled):not(.disabled):active, .btn-facebook:not(:disabled):not(.disabled).active,
.show > .btn-facebook.dropdown-toggle {
  color: #fff;
  background-color: #2d4373;
  border-color: #dfdfdf;
}

.btn-facebook:not(:disabled):not(.disabled):active:focus, .btn-facebook:not(:disabled):not(.disabled).active:focus,
.show > .btn-facebook.dropdown-toggle:focus {
  -webkit-box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.5);
}
</style>