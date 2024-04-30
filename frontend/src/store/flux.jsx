import toast from "react-hot-toast";

const backendURL =
  import.meta.env.DEV
    ? import.meta.env.VITE_APP_BACKEND_URL
    : "";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      modalView: false,
      imprescindibleToggle: true,
      pending: 0,
      generalToast: { state: false, message: "", type: "primary" },
      updatedList: 0,
      currentEventResponses: [],
      currentEventViability: true,
      eventReady: false,
      fetchedEvent: {},
      currentEventsRejections: [],
      yaInvitado: false,
      inviteesDetails: [],
      currentEventsInvitees: [],
      loggedIn: false,
      bloquesUsuarioActual: [],
      fechasPosiblesSeparadas: [],
      horarios: [],
      currentUserInfo: {},
      evento: {
        idEvento: null,
        nombre: null,
        lugar: null,
        inicio: null, //parse para el backend
        final: null, //parse para el backend
        duracion: null, //aun no del todo definitivo
        organizador: null, //id
        invitados: [], //ids
        imprescindibles: [],
        rechazados: [],
        respondidos: [], //los nombres los pone acá el front end para dibujarlos
        respuestas: [],
        descripcion: null,
        privacidad: [true, true, true, true],
        requisitos: [true, false, false, false],
      },
    },
    actions: {
      modalToggle: (bool) => {
        setStore({ modalView: bool });
      },
      testBackend: async () => {
        if (import.meta.env.DEV) {
          console.log(import.meta.env.DEV);
          try {
            const response = await fetch(backendURL + "api/test");
            if (response.status != 200) {
              throw new Error("Reuplan no está en linea");
            }
            const data = await response.json();
            toast.success(data.msg + " DEV MODE"); // Assuming the API response has a "message" field
          } catch (error) {
            toast.error("Reuplan no está en linea");
          }
        }
      },
      getSession: () => {
        return fetch(backendURL + "api/auth", {
          method: "GET",
          headers: {
            Authorization: "Token " + localStorage.getItem("reuPlanToken"),
          },
        })
          .then((response) => {
            if (response.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, inténtalo más tarde"
              );
              throw new Error("Rate limit exceeded");
            } else if (response.status === 401) {
              setStore({ loggedIn: false });
              return response.json();
            } else if (!response.ok) {
              throw new Error("Network response was not ok");
            } else {
              return response.json();
            }
          })
          .then((data) => {
            if (data && data.isAuthenticated) {
              setStore({ loggedIn: true });
            }
          })
          .catch((error) => {});
      },
      findPending: () => {
        const store = getStore();
        let pending = store.currentUsersInvitations.length;
        for (let invitacion of store.currentUsersInvitations) {
          if (
            store.currentUsersResponses.some(
              (respuesta) => respuesta.evento == invitacion.evento
            ) ||
            store.currentUsersRejections.some(
              (respuesta) => respuesta.evento == invitacion.evento
            )
          ) {
            pending -= 1;
          }
        }
        setStore({ pending });
      },
      userInvitesAndResponses: () => {
        const actions = getActions();
        fetch(
          backendURL +
            "api/user/" +
            localStorage.getItem("reuPlanUserID") +
            "/participation",
          {
            headers: {
              "Content-type": "application/json",
              Authorization: "Token " + localStorage.getItem("reuPlanToken"),
            },
          }
        )
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            }
            if (resp.status == 200) {
              return resp.json();
            }
          })
          .then((data) => {
            const currentUsersInvitations = data.received_invitations;
            const currentUsersResponses = data.responses;
            const currentUsersRejections = data.emitted_rejections;
            setStore({
              currentUsersInvitations,
              currentUsersResponses,
              currentUsersRejections,
            });
            actions.findPending();
          })
          .catch((error) => {});
      },
      editUser: (e, navigate) => {
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{10,}$/;
        const store = getStore();
        e.preventDefault();
        const actions = getActions();
        let answers = {
          userID: parseFloat(localStorage.getItem("reuPlanUserID")),
          password: e.target[2].value,
          name: e.target[5].value,
        };
        if (answers.password === "") {
          delete answers.password;
        }
        if (!passwordPattern.test(answers.password) && answers.password) {
          toast.error(
            "La contraseña debe tener al menos 10 caracteres y contener al menos una letra mayúscula, un símbolo y un número."
          );
          return;
        }
        if (
          answers.password === undefined &&
          answers.name === store.currentUserInfo.name
        ) {
          toast("No se hicieron cambios");
        } else {
          fetch(backendURL + "api/user/edit", {
            method: "PATCH",
            headers: {
              "Content-type": "application/json",
              Authorization: "Token " + localStorage.getItem("reuPlanToken"),
            },
            body: JSON.stringify(answers),
          })
            .then((resp) => {
              if (resp.status === 429) {
                toast.error(
                  "Límite de solicitudes excedido, intentalo más tarde"
                );
                return;
              }
              if (resp.status == 200) {
                toast.success("Datos de cuenta actualizados");
                return resp.json();
              }
            })
            .then((data) => {
              if (answers.password) {
                actions.logout(navigate);
              }
            })
            .catch((error) => {});
        }
      },
      fetchCurrentUser: (id) => {
        fetch(backendURL + "api/user/get/" + id, {
          Authorization: "Token " + localStorage.getItem("reuPlanToken"),
        })
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            }
            if (resp.status == 200) {
              return resp.json();
            }
          })
          .then((data) => {
            const currentUserInfo = data;
            setStore({ currentUserInfo });
          })
          .catch((error) => {});
      },
      resetUserInfo: () => {
        setStore({ currentUserInfo: undefined });
      },
      editEvent: (e, id) => {
        if (e.target[3].value < e.target[2].value) {
          toast.error("El final del evento debe ser posterior a su inicio");
          return;
        }
        fetch(backendURL + "api/event/create", {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Authorization: "Token " + localStorage.getItem("reuPlanToken"),
          },
          body: JSON.stringify({
            idEvento: id,
            organizador: localStorage.getItem("reuPlanUserID"),
            name: e.target[1].value,
            inicio: e.target[2].value,
            final: e.target[3].value,
            duracion: parseInt(e.target[4].value),
            lugar: e.target[5].value,
            mapsQuery: e.target[6].checked,
            descripcion: e.target[7].value,
            privacidad1: e.target[8].checked,
            privacidad2: e.target[9].checked,
            privacidad3: e.target[10].checked,
            privacidad4: e.target[11].checked,
            requisitos1: e.target[12].checked,
            requisitos2: e.target[13].checked,
            requisitos3: e.target[14].checked,
            requisitos4: e.target[15].checked,
          }),
        })
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            }
            if (resp.status == 201) {
              toast.success("Evento editado exitosamente");
              return resp.json();
            }
          })
          .then((data) => {})
          .catch((error) => {});
      },
      mainEventView: (eventID, navigate) => {
        const store = getStore();
        if (store.eventFound === false) {
          navigate("/eventList");
        }
        const actions = getActions();
        fetch(backendURL + "api/event/get/" + eventID, {
          headers: {
            Authorization: "Token " + localStorage.getItem("reuPlanToken"),
          },
        })
          .then((resp) => {
            if (resp.status === 404) {
              toast.error("Evento no encontrado");
              setStore({ eventFound: false });
              navigate("/eventList");
              return;
            } else if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            } else {
              return resp.json();
            }
          })
          .then((data) => {
            if (data) {
              setStore({ fetchedEvent: data });
              actions.rebuildEventFromAPI(navigate);
            }
          })
          .catch((error) => {});
      },
      rebuildEventFromAPI: (navigate) => {
        const currentUser = localStorage.getItem("reuPlanUserID");
        const actions = getActions();
        const store = getStore();
        store.evento.respuestas = [];
        store.evento.rechazados = [];
        store.evento.inicio = new Date(store.fetchedEvent.event.inicio+"T12:00:00");
        store.evento.final = new Date(store.fetchedEvent.event.final+"T12:00:00");
        store.evento.idEvento = store.fetchedEvent.event.id;
        store.evento.lugar = store.fetchedEvent.event.lugar;
        store.evento.duracion = store.fetchedEvent.event.duracion;
        store.evento.nombre = store.fetchedEvent.event.name;
        store.evento.organizador = store.fetchedEvent.organizador.id;
        store.evento.descripcion = store.fetchedEvent.event.descripcion;
        store.evento.invitados = [];
        store.fetchedEvent.invitaciones.forEach((invitacion) => {
          store.evento.invitados.push(invitacion.invitado.id);
        });
        store.evento.imprescindibles = [];
        store.fetchedEvent.invitaciones.forEach((invitacion) => {
          if (invitacion.imprescindible == true) {
            store.evento.imprescindibles.push(invitacion.invitado.id);
          }
          store.currentEventsRejections.forEach((invitado) => {
            store.evento.rechazados.push(invitado.id);
          });
        });

        store.evento.privacidad[0] = store.fetchedEvent.event.privacidad1;
        store.evento.privacidad[1] = store.fetchedEvent.event.privacidad2;
        store.evento.privacidad[2] = store.fetchedEvent.event.privacidad3;
        store.evento.privacidad[3] = store.fetchedEvent.event.privacidad4;
        store.evento.requisitos[0] = store.fetchedEvent.event.requisitos1;
        store.evento.requisitos[1] = store.fetchedEvent.event.requisitos2;
        store.evento.requisitos[2] = store.fetchedEvent.event.requisitos3;
        store.evento.requisitos[3] = store.fetchedEvent.event.requisitos4;

        const fechas = [];
        const contadorDias = new Date(store.fetchedEvent.event.inicio);
        const totalDays = //cantidad de dias en que puede hacerse el evento
          (store.evento.final.getTime() - store.evento.inicio.getTime()) /
          (1000 * 3600 * 24);
        for (let i = 0; i <= totalDays; i++) {
          //agrega a fechas las posibles fechas en formato yyyy-mm-dd
          fechas.push(contadorDias.toISOString().slice(0, 10));
          contadorDias.setDate(contadorDias.getDate() + 1);
        }
        let availableDays = []; //generar de las fechas las tuplas [yxxxx,mxx,dxx] para generar cada dia disponible
        fechas.forEach((fecha) => {
          availableDays.push([
            "y" + fecha.slice(0, 4),
            "m" + fecha.slice(5, 7),
            "d" + fecha.slice(8, 10),
          ]);
        });
        let answerIndex;
        for (let invitacion of store.fetchedEvent.invitaciones) {
          if (
            !store.evento.respuestas.some(
              (respuesta) => respuesta.invitado == invitacion.invitado.id
            )
          ) {
            store.evento.respuestas.push({
              userID: invitacion.invitado.id,
            });
          }
          answerIndex = store.evento.respuestas.findIndex(
            (elemento) => elemento.userID == invitacion.invitado.id
          );
        }
        for (let [y, m, d] of availableDays) {
          store.evento.respuestas.forEach((respuesta) => {
            respuesta[y] = respuesta[y] || {};
            respuesta[y][m] = respuesta[y][m] || {};
            respuesta[y][m][d] = [];
          });
        }
        for (let respuesta of store.fetchedEvent.respuestas) {
          const h = [respuesta.inicio, respuesta.final];
          const [y, m, d] = [
            "y" + respuesta.fecha.slice(0, 4),
            "m" + respuesta.fecha.slice(5, 7),
            "d" + respuesta.fecha.slice(8, 10),
          ];
          for (let horario of store.evento.respuestas) {
            if (horario.userID == respuesta.invitado) {
              if (horario[y][m][d] != undefined) {
                horario[y][m][d].push(h);
              }
            }
          }
        }
        setStore(store);

        actions.checkEachInviteesResponses();
        actions.meetingResultsToDate();
        actions.userBlocksToDate(localStorage.getItem("reuPlanUserID"));
        actions.getHostData();
        actions.calculateViability();
        actions.userInvitesAndResponses();
        actions.findInviteesDetails(
          localStorage.getItem("reuPlanUserCurrentEvent")
        );

        store.eventReady = true;
      },
      queryUser: (searchValue, setUsuarioExiste) => {
        const store = getStore();
        const actions = getActions();
        fetch(backendURL + "api/user", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: "Token " + localStorage.getItem("reuPlanToken"),
          },
          body: JSON.stringify({ search_query: searchValue }),
        })
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            } else if (resp.status == 200) {
              return resp.json();
            } else if (resp.status == 404) {
              if (setUsuarioExiste != undefined) {
                setUsuarioExiste(false);
                const yaInvitado = false;
                setStore({ yaInvitado });
              }
            }
          })
          .then((data) => {
            if (data != undefined && setUsuarioExiste != undefined) {
              setUsuarioExiste(true);
              actions.createNewInvite(data.data.id);
              actions.userInvitesAndResponses();
            }
          })
          .catch((error) => {});
      },
      findInviteesDetails: () => {
        const store = getStore();
        const inviteesDetails = [];
        store.fetchedEvent.invitaciones.forEach((invitacion) => {
          inviteesDetails.push(invitacion.invitado);
        });
        setStore({ inviteesDetails });
      },
      calculateViability: () => {
        const store = getStore();
        if (
          store.fetchedEvent.invitaciones.some(
            (inv) =>
              inv.imprescindible == true &&
              store.fetchedEvent.rechazos.some(
                (rej) => inv.invitado.id == rej.invitado
              )
          )
        ) {
          const currentEventViability = false;
          setStore({ currentEventViability });
        } else {
          const currentEventViability = true;
          setStore({ currentEventViability });
        }
      },
      emptyInviteesDetails: () => {
        const inviteesDetails = [];
        setStore(inviteesDetails);
      },
      getHostData: () => {
        const store = getStore();
        const hostData = store.fetchedEvent.organizador;
        setStore({ hostData });
      },

      findEventRejections: (idEvento) => {
        let { currentEventsRejections } = getStore();
        fetch(backendURL + "api/rejections", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: "Token " + localStorage.getItem("reuPlanToken"),
          },
          body: JSON.stringify({
            idEvento: idEvento,
          }),
        })
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            } else if (resp.status == 200) {
              return resp.json();
            }
          })
          .then((data) => {
            currentEventsRejections = data.data;
            setStore({ currentEventsRejections });
          })
          .catch((error) => {});
      },
      rejectInvite: (navigate) => {
        const actions = getActions();
        fetch(backendURL + "api/rejection", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: "Token " + localStorage.getItem("reuPlanToken"),
          },
          body: JSON.stringify({
            invitado: localStorage.getItem("reuPlanUserID"),
            evento: localStorage.getItem("reuPlanCurrentEvent"),
          }),
        })
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            } else if (resp.status == 201) {
              actions.mainEventView(
                localStorage.getItem("reuPlanCurrentEvent"),
                navigate
              );
              actions.userInvitesAndResponses();
              toast("Evento rechazado");
              return resp.json();
            }
          })
          .then((data) => {})
          .catch((error) => {});
      },
      createNewInvite: (inviteeID, navigate) => {
        const actions = getActions();
        fetch(backendURL + "api/invite", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: "Token " + localStorage.getItem("reuPlanToken"),
          },
          body: JSON.stringify({
            invitado: inviteeID,
            evento: localStorage.getItem("reuPlanCurrentEvent"),
            imprescindible: false,
          }),
        })
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            } else if (resp.status == 201) {
              toast.success("Usuario invitado exitosamente");
              actions.getEvent(localStorage.getItem("reuPlanCurrentEvent"));
              actions.mainEventView(localStorage.getItem("reuPlanCurrentEvent"),navigate)
              return resp.json();
            } else if (resp.status == 409) {
              toast.error("Usuario ya invitado");
            } else if (resp.status === 404) {
              toast.error("Usuario no encontrado");
            }
          })
          .then((data) => {})
          .catch((error) => {});
      },
      toggleImprescindible: (inviteID) => {
        const actions = getActions();
        const store = getStore();
        fetch(backendURL + "api/invite/" + inviteID + "/toggle", {
          Authorization: "Token " + localStorage.getItem("reuPlanToken"),
        })
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            } else if (resp.status == 200) {
              toast("Tipo de invitado cambiado");
              actions.getEvent(localStorage.getItem("reuPlanCurrentEvent"));

              return resp.json();
            } else {
            }
          })
          .then((data) => {})
          .catch((error) => {});
      },
      deleteEvent: (id, navigate) => {
        const actions = getActions();
        fetch(backendURL + "api/event/" + id + "/delete", {
          headers: {
            Authorization: "Token " + localStorage.getItem("reuPlanToken"),
          },
        })
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            } else if (resp.status == 200) {
              navigate("/eventList");
              toast("Evento eliminado");
              actions.findInviteesDetails();
              actions.userInvitesAndResponses();
              return resp.json();
            }
          })
          .then((data) => {})
          .catch((error) => {});
      },
      uninviteUser: (id) => {
        const actions = getActions();
        fetch(backendURL + "api/invite/delete/" + id, {
          headers: {
            Authorization: "Token " + localStorage.getItem("reuPlanToken"), //ENCONTRAR EVENTO ACA
          },
        })
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            } else if (resp.status == 200) {
              toast("Invitación eliminada satisfactoriamente");
              actions.getEvent(localStorage.getItem("reuPlanCurrentEvent"));
              return resp.json();
            }
          })
          .then((data) => {})
          .catch((error) => {});
      },
      getEvent: (eventID) => {
        const actions = getActions();
        fetch(backendURL + "api/event/get/" + eventID, {
          method: "GET",
          headers: {
            Authorization: "Token " + localStorage.getItem("reuPlanToken"), //ENCONTRAR EVENTO ACA
          },
        })
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            } else if (resp.status == 200) {
              return resp.json();
            }
          })
          .then((data) => {
            setStore({ fetchedEvent: data, eventReady: true });
            actions.findInviteesDetails();
          })
          .catch((error) => {});
      },
      getAllEvents: () => {
        const store = getStore();
        fetch(backendURL + "api/events", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: "Token " + localStorage.getItem("reuPlanToken"),
          },
        })
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            } else if (resp.status == 200) {
              return resp.json();
            }
          })
          .then((data) => {
            store.events = data;
            setStore(store);
          })
          .catch((error) => {});
      },
      createEvent: (e, navigate, createdEvent) => {
        const actions = getActions();
        const nullified = {};
        const answers = {
          name: e.target[1].value,
          inicio: e.target[2].value,
          final: e.target[3].value,
          duracion: parseInt(e.target[4].value),
          lugar: e.target[5].value,
          mapsQuery: e.target[6].checked,
          descripcion: e.target[7].value,
          privacidad1: e.target[8].checked,
          privacidad2: e.target[9].checked,
          privacidad3: e.target[10].checked,
          privacidad4: e.target[11].checked,
          requisitos1: e.target[12].checked,
          requisitos2: e.target[13].checked,
          requisitos3: e.target[14].checked,
          requisitos4: e.target[15].checked,
          organizador: parseInt(localStorage.getItem("reuPlanUserID")),
          respondidos: 0,
        };
        if (answers.final < answers.inicio) {
          toast.error("El final del evento debe ser posterior a su inicio");
          return {};
        }
        for (let answer in answers) {
          if (answers[answer] === "") {
            nullified[answer] = null;
          } else {
            nullified[answer] = answers[answer];
          }
        }

        fetch(backendURL + "api/event/create", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: "Token " + localStorage.getItem("reuPlanToken"),
          },

          body: JSON.stringify(nullified),
        })
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            }
            if (resp.status == 400) {
              toast.error(resp.msg);
            }
            if (resp.status == 201) {
              return resp.json();
            }
          })
          .then((data) => {
            actions.getEvent(data.id);
            localStorage.setItem("reuPlanCurrentEvent", data.id);
            navigate("/create#invitadosList");
            createdEvent(true);
          })

          .catch((error) => {});
      },
      logout: (navigate) => {
        navigate("/login");
        const actions = getActions();
        fetch(backendURL + "api/logout", {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: "Token " + localStorage.getItem("reuPlanToken"),
          },
          body: JSON.stringify({
            username: localStorage.getItem("reuPlanUser"),
          }),
        });
        toast("Haz cerrado sesión");
        localStorage.removeItem("reuPlanUser");
        localStorage.removeItem("reuPlanToken");
        localStorage.removeItem("reuPlanUserID");
        setStore({ loggedIn: false });
      },
      createUser: (e, navigate) => {
        const actions = getActions();
        e.preventDefault();
        const usernamePattern = /^[a-zA-Z0-9]{8,}$/;
        const passwordPattern =
          /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{10,}$/;
        if (!usernamePattern.test(e.target[1].value)) {
          toast.error(
            "El nombre de usuario solo puede contener minúsculas, mayúsculas y números."
          );
          return;
        } else if (e.target[2].value != e.target[4].value) {
          toast.error("Las contraseñas no coincidien.");
          return;
        } else if (!passwordPattern.test(e.target[2].value)) {
          toast.error(
            "La contraseña debe tener al menos 10 caracteres y contener al menos una letra mayúscula, un símbolo y un número."
          );
          return;
        } else {
          fetch(backendURL + "api/user/create", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
              username: e.target[1].value,
              password: e.target[2].value,
              email: e.target[3].value,
              name: e.target[5].value,
              key: e.target[6].value,
            }),
          })
            .then((resp) => {
              if (resp.status === 429) {
                toast.error(
                  "Límite de solicitudes excedido, intentalo más tarde"
                );
                return resp.json;
              }
              if (resp.status == 400) {
                return resp.json();
              }
              if (resp.status == 201) {
                toast.success("Cuenta creada satisfactoriamente!");
                navigate("/login");
                return resp.json();
              }
            })
            .then((data) => {
              if (data.error) {
                toast.error("Código inválido o expirado");
              }else
              if (data.error && data.email) {
                toast.error("Email inválido o en uso");
              }else
              if (data.error && data.username) {
                toast.error("Nombre de usuario ya en uso");
              }
            })
            .catch((error) => {});
        }
      },
      loginAttempt: (e, navigate) => {
        const actions = getActions();
        e.preventDefault();
        fetch(backendURL + "api/login", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            username: e.target.form[0].value,
            password: e.target.form[1].value,
          }),
        })
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            } else if (resp.status == 404 || resp.status == 401) {
              toast.error("Credenciales incorrectas");
            } else if (resp.status == 200) {
              toast("Bienvenidx de vuelta!");
              return resp.json();
            }
          })
          .then((data) => {
            if (data != undefined) {
              localStorage.setItem("reuPlanUser", e.target.form[0].value);
              localStorage.setItem("reuPlanUserID", data.user_id);
              localStorage.setItem("reuPlanToken", data.token);
              actions.getSession();
              setStore({ loggedIn: true });
              navigate("/");
            }
          })
          .catch((error) => {
            if (error.status == 404) {
            }
          });
      },
      checkEachInviteesResponses: () => {
        //revisa la respuesta de cada invitado para cada dia posible del evento => evento.respondidos
        //edita la propiedad "respondidos" del evento de acuerdo a lo mencionado arriba
        // ES PARA UN EVENTO
        const store = getStore();
        const fechas = [];
        const contadorDias = new Date(store.evento.inicio);
        let totalDays;
        if (store.evento.final) {
          totalDays = //cantidad de dias en que puede hacerse el evento
            (store.evento.final.getTime() - store.evento.inicio.getTime()) /
            (1000 * 3600 * 24);
        }

        for (let i = 0; i <= totalDays; i++) {
          //agrega a fechas las posibles fechas en formato yyyy-mm-dd
          fechas.push(contadorDias.toISOString().slice(0, 10));
          contadorDias.setDate(contadorDias.getDate() + 1);
        }

        let availableDays = []; //generar de las fechas las tuplas [yxxxx,mxx,dxx] para generar cada dia
        fechas.forEach((fecha) => {
          availableDays.push([
            "y" + fecha.slice(0, 4),
            "m" + fecha.slice(5, 7),
            "d" + fecha.slice(8, 10),
          ]);
        });
        const checkedUser = [];
        store.evento.respuestas.forEach((respuesta, i) => {
          for (let [y, m, d] of availableDays) {
            if (respuesta[y][m][d] != "") {
              checkedUser.push(respuesta.userID);
              break;
            }
          }
        });
        store.evento.respondidos = checkedUser;
        setStore(store);
      },
      addNewAvailability: (e, navigate) => {
        const actions = getActions();
        if (e.target.fechaNuevoBloque.value == "") {
          toast.error("Elige una fecha!");
          return;
        }
        const idEvento = localStorage.getItem("reuPlanCurrentEvent");
        const newYear = e.target.fechaNuevoBloque.value.slice(6);
        const newMonth = e.target.fechaNuevoBloque.value.slice(3, 5);
        const newDay = e.target.fechaNuevoBloque.value.slice(0, 2);
        const newStart = e.target.horaInicioNuevoBloque.value;
        const newEnd = e.target.horaFinalNuevoBloque.value;
        const userID = localStorage.getItem("reuPlanUserID");
        if (newEnd - newStart <= 0) {
          toast.error("La hora final debe ser posterior a la de inicio!");
        } else {
          fetch(backendURL + "api/schedule", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: "Token " + localStorage.getItem("reuPlanToken"),
            },
            body: JSON.stringify({
              evento: idEvento,
              invitado: userID,
              fecha: `${newYear}-${newMonth}-${newDay}`,
              inicio: newStart * 100,
              final: newEnd * 100,
            }),
          })
            .then((resp) => {
              if (resp.status === 429) {
                toast.error(
                  "Límite de solicitudes excedido, intentalo más tarde"
                );
                return;
              }
              if (resp.status == 201) {
                toast.success("Horario agregado", "primary");
                actions.mainEventView(
                  localStorage.getItem("reuPlanCurrentEvent")
                );

                return resp.json();
              }
            })
            .then((data) => {
              if (data != undefined) {
              }
            })
            .catch((error) => {});
        }
      },
      deleteAvailability: (id, navigate) => {
        const actions = getActions();
        fetch(backendURL + "api/schedule/" + id + "/delete", {
          headers: {
            Authorization: "Token " + localStorage.getItem("reuPlanToken"),
          },
        })
          .then((resp) => {
            if (resp.status === 429) {
              toast.error(
                "Límite de solicitudes excedido, intentalo más tarde"
              );
              return;
            }
            if (resp.status == 200) {
              toast("Horario eliminado");
              actions.mainEventView(
                localStorage.getItem("reuPlanCurrentEvent"),
                navigate
              );
              actions.userInvitesAndResponses();
            }
          })
          .then((data) => {})
          .catch((error) => {});
      },
      userBlocksToDate: () => {
        //Take the responses of the user for an event and creates dates objects
        //transforma los bloques del usuario en un arreglo con arreglos [Date,h,id]
        const store = getStore();
        const userID = localStorage.getItem("reuPlanUserID");
        const userBlocks = store.fetchedEvent.respuestas.filter(
          (respuesta) => respuesta.invitado == userID
        );
        const userBlocksDeletable = userBlocks.map((block) => {
          let fecha = new Date(block.fecha + "T12:00:00");
          return [fecha, [block.inicio, block.final], block.id];
        });
        setStore({ bloquesUsuarioActual: userBlocksDeletable });
      },
      meetingResultsToDate: () => {
        //Takes the result of the meeting info and creates date objects
        //Transforma las fechas resultantes en arreglos separados [Date,horario]
        const currentStore = getStore();
        const meetingResults = currentStore.horarios.filter(
          (element) => element[3] != ""
        );
        const dateAndSchedule = meetingResults.map(([y, m, d, h, id]) => {
          return [
            new Date(y.slice(1, 5), m.slice(1, 3) - 1, d.slice(1, 3)),
            h,
            y,
            m,
            d,
          ];
        });
        const result = [];
        dateAndSchedule.forEach((element) => {
          element[1].forEach((schedule) => {
            result.push([
              element[0],
              schedule,
              element[2],
              element[3],
              element[4],
            ]);
          });
        });
        setStore({ fechasPosiblesSeparadas: result });
      },
      countCalendar: () => {
        //Parses the data for the calendar to fill in and draw the blocks
        const actions = getActions();
        //Analiza todas las disponibilidades de invitados y las calcula para el calendario final
        const store = getStore();
        const fechas = [];
        const contadorDias = new Date(store.evento.inicio);
        let totalDays;
        if (store.evento.final) {
          totalDays = //cantidad de dias en que puede hacerse el evento
            (store.evento.final.getTime() - store.evento.inicio.getTime()) /
            (1000 * 3600 * 24);
        }

        for (let i = 0; i <= totalDays; i++) {
          //agrega a fechas las posibles fechas en formato yyyy-mm-dd
          fechas.push(contadorDias.toISOString().slice(0, 10));
          contadorDias.setDate(contadorDias.getDate() + 1);
        }

        let availableDays = []; //generar de las fechas las tuplas [yxxxx,mxx,dxx] para generar cada dia
        fechas.forEach((fecha) => {
          availableDays.push([
            "y" + fecha.slice(0, 4),
            "m" + fecha.slice(5, 7),
            "d" + fecha.slice(8, 10),
          ]);
        });

        setStore({ horarios: [] });
        availableDays.forEach(([anno, mes, dia]) => {
          //Por cada fecha en que el evento es posible mira las posibilidades de los asistentes
          let countingCalendar = new Array(24);
          countingCalendar.fill(0, 0);
          let booleanCalendar = new Array(24);
          let possibleHours = [];
          let possibleBlock = [];

          for (let respuesta of store.evento.respuestas) {
            //respuesta por invitado => horario de booleanos => countingCalendar muestra la suma de true's (asistencias)
            booleanCalendar = booleanCalendar.map((element) => 0);
            if (respuesta[anno][mes][dia]) {
              for (let horario of respuesta[anno][mes][dia]) {
                booleanCalendar.fill(true, horario[0] / 100, horario[1] / 100);
              }
            }

            booleanCalendar.forEach((hour, i) => {
              if (hour === true) {
                countingCalendar[i] += 1;
              }
            });
          }
          countingCalendar.forEach((hour, i) => {
            // por cada bloque: Suma de asistencias = Cantidad de asistentes ? = ese bloque es posible
            if (
              store.evento.respondidos.length > 0 &&
              hour == store.evento.respondidos.length
            ) {
              possibleHours.push(i);
            }
          });
          //Condiciones para ver como se comporta cada bloque de una hora para generar los pares [inicio,final]
          if (possibleHours.length == 0) {
            //No hay bloques posibles
            setStore({
              horarios: [
                ...store.horarios,
                [anno, mes, dia, [], store.evento.idEvento],
              ],
            });
          } else {
            possibleBlock.push([possibleHours[0], possibleHours[0] + 1]);
            possibleHours.forEach((hour, i) => {
              if (i == 0 && possibleHours[i + 1] - hour > 1) {
                //El bloque a es el primero y esta solo => [[a,a+1],...]
              } else if (possibleHours.length == 1) {
                //El bloque a es el único  [[a,a+1]]
              } else if (
                possibleHours[i + 1] - hour == 1 && //El bloque a esta rodeado de bloques consecutivos => no cambia las tuplas
                hour - possibleHours[i - 1] == 1
              ) {
              } else if (
                i == possibleHours.length - 1 && //El bloque a es el último y está solo => [...[a,a+1]]
                hour - possibleHours[i - 1] > 1
              ) {
                possibleBlock.push([hour, hour + 1]);
              } else if (i == possibleHours.length - 1) {
                //El bloque a es el último => [...,[x,a]]
                possibleBlock[possibleBlock.length - 1][1] = hour + 1;
              } else if (possibleHours[i + 1] - hour > 1) {
                //El bloque no es último y cierra un bloque consecutivo => [...,[x,a+1],...]
                possibleBlock[possibleBlock.length - 1][1] = hour + 1;
              } else if (hour - possibleHours[i - 1] > 1) {
                //El bloque no es el primero y abre bloques consecutivos [...,[a,x],...]
                possibleBlock.push([hour, hour + 1]);
              }
            });

            setStore({
              horarios: [
                ...store.horarios,
                [anno, mes, dia, possibleBlock, store.evento.idEvento],
              ], //possibleBlock es un array con arrays del tipo [inicio,final] de horarios posibles
            });
          }
        });
        actions.meetingResultsToDate();
      },
    },
  };
};
export default getState;
