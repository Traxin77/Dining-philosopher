
class Philosopher {
    constructor(name, leftFork, rightFork) {
      this.name = name;
      this.leftFork = leftFork;
      this.rightFork = rightFork;
    }
  
    async think() {
      console.log(`${this.name} is thinking...`);
      document.getElementById(`${this.name}`).style.backgroundColor= "#33FF71";
      await delay(2000); 
    }
  
    async eat() {
      await this.takeForks();
      console.log(`${this.name} is eating...`);
      document.getElementById(`${this.name}`).style.backgroundColor="#D70040";
      await delay(2000);
      this.releaseForks();
      console.log(`${this.name} finished eating and released the forks.`);
      console.log(document.getElementById(`${this.name}`));
    }
  
    async takeForks() {
      await Promise.all([this.leftFork.acquire(), this.rightFork.acquire()]);
    }
  
    releaseForks() {
      this.leftFork.release();
      this.rightFork.release();
    }
  
    async start() {
      while (true) {
        await this.think();
        await delay(1000);
        await this.eat();
      }
    }
}
  
class Fork {
    constructor(id) {
      this.id = id;
      this.isAvailable = true;
      this.acquireQueue = [];
    }
  
    async acquire() {
      if (this.isAvailable) {
        this.isAvailable = false;
      } else {
        await new Promise((resolve) => this.acquireQueue.push(resolve));
      }
    }
  
    release() {
      this.isAvailable = true;
      if (this.acquireQueue.length > 0) {
        const resolve = this.acquireQueue.shift();
        resolve();
      }
    }
}
  
  
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
  
  const forks = [
    new Fork(1),
    new Fork(2),
    new Fork(3),
    new Fork(4),
    new Fork(5),
  ];
  

  // Creating philosophers
  const philosophers = [
    new Philosopher("Philosopher1", forks[0], forks[1]),
    new Philosopher("Philosopher2", forks[1], forks[2]),
    new Philosopher("Philosopher3", forks[2], forks[3]),
    new Philosopher("Philosopher4", forks[3], forks[4]),
    new Philosopher("Philosopher5", forks[4], forks[0]),
  ];
  
  philosophers.forEach((philosopher) => philosopher.start());