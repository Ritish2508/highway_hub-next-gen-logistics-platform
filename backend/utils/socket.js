let io = null;

export const setIo = (socketIo) => {
  io = socketIo;
};

export const getIo = () => io;