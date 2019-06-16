const Server = jest.fn(() => ({
  start: jest.fn(),
}));

const stopper = {
  stop: jest.fn(),
};

export { Server, stopper };
