const options = {
  ops: {
    interval: 1000
  },
  reporters: {
    myConsoleReporter: [
      {
        module: "good-squeeze",
        name: "Squeeze",
        args: [{ log: "*", response: "*" }]
      },
      {
        module: "good-console"
      },
      "stdout"
    ],
    myFileReporter: [
      {
        module: "good-squeeze",
        name: "Squeeze",
        args: [{ ops: "*" }]
      },
      {
        module: "good-squeeze",
        name: "SafeJson"
      },
      {
        module: "good-file",
        args: ["./test/fixtures/awesome_log"]
      }
    ]
  }
};

// {
//   plugin: require("good"),
//   options
// },
