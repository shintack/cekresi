import { Notify } from "quasar";
import { login, loginOtp, refreshToken, profile, register } from "./api";
import store from "../store";

export function loginOtpAndGetProfile({ username, otp }, vueContext) {
  return loginOtp({
    username,
    otp
  })
    .then(payload => {
      store.dispatch("user/login", {
        // accessToken: payload.data.token,
        // refreshToken: payload.data.refresh_token ? payload.data.refresh_token : null
        accessToken: payload.access_token,
        refreshToken: payload.refresh_token
      });

      return profile({
        bearerTokenOverride: payload.access_token
      })
        .then(({ data, errors }) => {
          if (!errors && data) {
            store
              .dispatch("user/updateRawProfile", JSON.stringify(data))
              .then(result => {
                /*
                const accesses = vueContext.$store.getters['user/accesses'];
                if (accesses && accesses.length > 0) {
                  vueContext.$store.dispatch(
                    'user/updateAccessId',
                    accesses[0].id
                  );
                } else {
                  console.log('No Access');
                }
                */
              });
          }
        })
        .catch(e => {
          Notify.create({
            message: "Update profile gagal",
            timeout: 5000,
            type: "negative",
            color: "negative",
            icon: "warning"
          });

          throw e;
        });
    })
    .catch(e => {
      Notify.create({
        message: "Login gagal",
        timeout: 5000,
        type: "negative",
        color: "negative",
        icon: "warning"
      });

      throw e;
    });
}

export function loginAndGetProfile({ username, password }, vueContext) {
  return login({
    username,
    password
  })
    .then(payload => {
      store.dispatch("user/login", {
        accessToken: payload.data.access_token,
        refreshToken: payload.data.refresh_token
          ? payload.data.refresh_token
          : null // accessToken: payload.access_token,
        // refreshToken: payload.refresh_token
      });

      return profile({
        bearerTokenOverride: payload.data.access_token
      })
        .then(({ data, errors }) => {
          if (!errors && data) {
            store
              .dispatch("user/updateRawProfile", JSON.stringify(data))
              .then(result => {
                /*
                const accesses = vueContext.$store.getters['user/accesses'];
                if (accesses && accesses.length > 0) {
                  vueContext.$store.dispatch(
                    'user/updateAccessId',
                    accesses[0].id
                  );
                } else {
                  console.log('No Access');
                }
                */
              });
          }
        })
        .catch(e => {
          Notify.create({
            message: "Update profile gagal",
            timeout: 5000,
            type: "negative",
            color: "negative",
            icon: "warning"
          });

          throw e;
        });
    })
    .catch(e => {
      Notify.create({
        message: "Login gagal",
        timeout: 5000,
        type: "negative",
        color: "negative",
        icon: "warning"
      });

      throw e;
    });
}

export function registerAndGetProfile(
  { name, email, phone, password, c_password },
  vueContext
) {
  return register({
    name,
    email,
    phone,
    password,
    c_password
  })
    .then(payload => {
      const data = {
        username: email,
        password: password
      };
      return login(data)
        .then(payload => {
          vueContext.$store.dispatch("user/login", {
            // accessToken: payload.data.token,
            // refreshToken: payload.data.refresh_token ? payload.data.refresh_token : null
            accessToken: payload.access_token,
            refreshToken: payload.refresh_token
          });

          return profile({
            bearerTokenOverride: payload.access_token
          })
            .then(({ data, errors }) => {
              if (!errors && data) {
                vueContext.$store
                  .dispatch("user/updateRawProfile", JSON.stringify(data))
                  .then(result => {
                    // myPoint().then(r => {
                    //   vueContext.$store.dispatch(
                    //     'user/updateMyPoint',
                    //     JSON.stringify(r.data)
                    //   );
                    // }).catch(e => {
                    //   Notify.create({
                    //     message: 'Update Point gagal',
                    //     timeout: 5000,
                    //     type: 'negative',
                    //     color: 'negative',
                    //     icon: 'warning'
                    //   });
                    // });
                    const accesses = vueContext.$store.getters["user/accesses"];
                    if (accesses && accesses.length > 0) {
                      vueContext.$store.dispatch(
                        "user/updateAccessId",
                        accesses[0].id
                      );
                    } else {
                      console.log("No Access");
                    }
                  });
              }
            })
            .catch(e => {
              Notify.create({
                message: "Update profile gagal",
                timeout: 5000,
                type: "negative",
                color: "negative",
                icon: "warning"
              });

              throw e;
            });
        })
        .catch(e => {
          Notify.create({
            message: "Login gagal",
            timeout: 5000,
            type: "negative",
            color: "negative",
            icon: "warning"
          });

          throw e;
        });
    })
    .catch(e => {
      Notify.create({
        message: "Register gagal",
        timeout: 5000,
        type: "negative",
        color: "negative",
        icon: "warning"
      });

      throw e;
    });
}

export function logout(vueContext = null) {
  store.dispatch("user/logout");
  if (vueContext != null) {
    vueContext.$router.push({
      name: "welcome"
    });
  }
}

export function refreshTokenAndProfile(vueContext) {
  return refreshToken(
    {
      refresh_token: vueContext.$store.state.user.refreshToken
    },
    {
      showErrorNotification: false
    }
  )
    .then(payload => {
      if (payload.access_token) {
        vueContext.$store.dispatch("user/login", {
          accessToken: payload.access_token,
          refreshToken: payload.refresh_token
        });

        return profile({
          bearerTokenOverride: payload.access_token
        })
          .then(({ data, errors }) => {
            if (!errors && data) {
              vueContext.$store.dispatch(
                "user/updateRawProfile",
                JSON.stringify(data)
              );
            } else {
              Notify.create({
                message: "Profile data tidak valid",
                timeout: 5000,
                type: "negative",
                color: "negative",
                icon: "warning"
              });
            }
          })
          .catch(e => {
            Notify.create({
              message: "Update profile gagal",
              timeout: 5000,
              type: "negative",
              color: "negative",
              icon: "warning"
            });

            throw e;
          });
      }

      // Notify.create({
      //   message: 'Refresh token gagal',
      //   timeout: 5000,
      //   type: 'negative',
      //   color: 'negative',
      //   icon: 'warning'
      // });

      // throw new Error('Refresh token gagal');
    })
    .catch(error => {
      if (error.response.status === 401) {
        // Notify.create({
        //   message: '<p>Token tidak valid</p><p>Silahkan melakukan login</p>',
        //   timeout: 5000,
        //   type: 'negative',
        //   color: 'negative',
        //   icon: 'warning',
        //   html: true
        // });
        // logout(vueContext, false);
        // vueContext.$router.push({
        //   name: 'login'
        // });
      }

      // throw error;
    });
}
