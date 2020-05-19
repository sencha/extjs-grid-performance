
export class TestMetrics {

   static timer_start({ sync = true, run_test }) {
       this.start = performance.now();
       this.testing = true;

       run_test && run_test();

       if (sync) {
           this.timer_stop();
       }
   }

   static timer_tick() {
    if (this.testing) {
      const elapsed = performance.now() - this.start;
      return elapsed;
    }
}




   static timer_stop() {
       if (this.testing) {
           const elapsed = performance.now() - this.start;
           this.testing = false;
           return elapsed;
       }
   }


   static scroll_speed_start() {
       this.start = null;
       this.testing = true;
       this.frames = [1];
       this.frame_count = 0;
       this.prev_frame_speed = null;
       requestAnimationFrame(this.frame_counter);
   }


   static scroll_speed_stop() {
       this.testing = false;
       const elapsed = performance.now() - this.start;
       const scrolling_speed = this.frame_count/(elapsed/1000);
       return {'Elapsed': elapsed, 'Frames': this.frame_count, 'Speed FPS': scrolling_speed}
   }


  static frame_counter() {
      const speed = performance.now();
      if (TestMetrics.start === null) {
          TestMetrics.start = speed;
          TestMetrics.prev_frame_speed = speed;
      } else {
          TestMetrics.frame_count++;
          TestMetrics.frames.push(speed - TestMetrics.prev_frame_speed);
      }
      TestMetrics.prev_frame_speed = speed;
      if (TestMetrics.testing) {
          requestAnimationFrame(TestMetrics.frame_counter)
      }
  }

  static scroller({ element, distance = 50000, scrolling_speed = 5, max_scrolling_speed = 1000,
                    acceleration = 1, run_test, scroll_function }) {

        let grid_top = 0;

        const interval_id = setInterval(() => {
            if (scroll_function) {
                scroll_function(grid_top)
            } else {
                element.scrollTop = grid_top;
            }

            grid_top += scrolling_speed;

            if (scrolling_speed < max_scrolling_speed) {
                scrolling_speed += acceleration;
            }

            if (grid_top > distance) {
                clearInterval(interval_id);
                run_test && run_test();
            }
        }, 1);
    }
}
