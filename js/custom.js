(function ($) {

  "use strict";

  // --- Navbar and Smooth Scrolling ---
  // Hide mobile menu on click
  $('.navbar-collapse a').on('click', function () {
    $(".navbar-collapse").collapse('hide');
  });

  // Smooth scroll to anchor links
  $('.smoothscroll').click(function () {
    var el = $(this).attr('href');
    var elWrapped = $(el);
    // Get header height dynamically
    var header_height = $('.navbar').outerHeight(); // Use outerHeight to include padding/border

    scrollToDiv(elWrapped, header_height);
    return false;

    function scrollToDiv(element, navheight) {
      var offset = element.offset();
      var offsetTop = offset.top;
      var totalScroll = offsetTop - navheight;

      $('body,html').animate({
        scrollTop: totalScroll
      }, 600); // Increased animation duration slightly
    }
  });

  // Add 'scrolled' class to navbar on scroll (optional for styling)
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll >= 50) { // Add class after scrolling 50px
      $('.navbar').addClass('scrolled');
    } else {
      $('.navbar').removeClass('scrolled');
    }
  });

})(window.jQuery);


// --- Bubble Animation Script (Provided by user) ---
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('bubble-container');
  // Select bubbles within the container
  const bubbles = container ? container.querySelectorAll('.bubble') : [];

  // --- Initial Checks ---
  if (!container) {
    console.error("Bubble container not found! Skipping bubble animation.");
    return; // Stop script if container doesn't exist
  }
  if (bubbles.length === 0) {
    console.warn("No bubbles found within #bubble-container. Skipping bubble animation.");
    return; // Stop script if no bubbles exist
  }

  // --- Setup ---
  let containerRect = container.getBoundingClientRect();
  let containerWidth = container.offsetWidth;
  let containerHeight = container.offsetHeight;

  const bubbleData = []; // Store data for each bubble
  let draggedBubble = null; // Track the bubble being dragged
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  const MAX_INIT_ATTEMPTS = 200; // Increase attempts for initial placement
  const BLUR_SPEED_THRESHOLD = 0.5; // Lower threshold, blur appears easier
  const BLUR_MAX_OPACITY = 0.8; // Max opacity of blur effect
  const BLUR_DISTANCE_FACTOR = 10; // How far behind the blur trails

  // Prevent text selection during drag (more robust)
  container.addEventListener('selectstart', function (e) {
    if (isDragging) {
      e.preventDefault();
    }
  });


  // --- Initialization ---
  function initializeBubbles() {
    console.log("Initializing bubbles...");
    bubbleData.length = 0; // Clear existing data if re-initializing

    // Update container dimensions first
    containerWidth = container.offsetWidth;
    containerHeight = container.offsetHeight;
    containerRect = container.getBoundingClientRect();
    console.log("Container Dims:", containerWidth, containerHeight);


    bubbles.forEach((bubble, index) => {
      // Important: Get dimensions *after* potential CSS changes and AOS
      const bubbleRect = bubble.getBoundingClientRect();
      const bubbleWidth = bubbleRect.width; // Use getBoundingClientRect for rendered dimensions
      const bubbleHeight = bubbleRect.height;

      if (bubbleWidth === 0 || bubbleHeight === 0) {
        console.warn(`Bubble ${index} has zero dimensions (${bubbleWidth}x${bubbleHeight}). Check CSS display/visibility or wait for layout.`);
        // This might happen if element is hidden or display:none initially.
        // Could add a retry or wait for layout here if needed.
        // For now, skip if dimensions are zero.
        return;
      }

      const radius = Math.max(bubbleWidth, bubbleHeight) / 2; // Use max dimension for collision radius approximation
      const speedFactor = parseFloat(bubble.dataset.speedFactor) || 1.0;
      const blurElement = bubble.querySelector('.blur-effect');

      let initialX, initialY, placementAttempts = 0, overlaps;

      // Initial placement logic (Retry to avoid overlap)
      do {
        overlaps = false;
        // Ensure bubble stays within container bounds during random placement
        initialX = Math.random() * (containerWidth - bubbleWidth);
        initialY = Math.random() * (containerHeight - bubbleHeight);

        // Check against bubbles already added in *this* initialization run
        for (let i = 0; i < bubbleData.length; i++) {
          const other = bubbleData[i];
          // Check if other bubble also has valid dimensions before calculating distance
          if (other.width > 0 && other.height > 0) {
            // Use center points for distance calculation
            const dx = (initialX + bubbleWidth / 2) - (other.x + other.width / 2);
            const dy = (initialY + bubbleHeight / 2) - (other.y + other.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            // Collision if distance is less than sum of half-widths/heights + buffer
            const minAllowedDistance = radius + other.radius + 10; // Add small buffer
            if (distance < minAllowedDistance) {
              overlaps = true; break;
            }
          }
        }
        placementAttempts++;
      } while (overlaps && placementAttempts < MAX_INIT_ATTEMPTS);

      if (placementAttempts >= MAX_INIT_ATTEMPTS) {
        console.warn(`Could not place bubble ${index} without overlap after ${MAX_INIT_ATTEMPTS} attempts.`);
        // Fallback: Place it randomly, might overlap
        initialX = Math.random() * (containerWidth - bubbleWidth);
        initialY = Math.random() * (containerHeight - bubbleHeight);
      }

      const angle = Math.random() * Math.PI * 2;
      const baseSpeed = 0.4; // Base speed (slightly slower)
      const speed = baseSpeed * speedFactor;

      bubbleData.push({
        element: bubble, blurElement: blurElement,
        x: initialX, y: initialY,
        dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed,
        prevDx: Math.cos(angle) * speed, prevDy: Math.sin(angle) * speed, // Initialize prevDx/y
        width: bubbleWidth, height: bubbleHeight, radius: radius,
        isDragging: false
      });

      // Apply initial position using transform
      bubble.style.transform = `translate(${initialX}px, ${initialY}px)`;
      bubble.style.opacity = '1'; // Ensure visible if AOS fade-in is not used

      // Add drag listeners (only once per bubble)
      // Check if listener already exists using a data attribute
      if (!bubble.hasAttribute('data-listeners-added')) {
        bubble.addEventListener('mousedown', onMouseDown);
        bubble.addEventListener('touchstart', onTouchStart, { passive: false }); // passive: false needed for preventDefault
        bubble.setAttribute('data-listeners-added', 'true');
      }
    });
    console.log("Bubble initialization complete. Count:", bubbleData.length);
  }


  // --- Drag Handlers ---
  function onMouseDown(e) {
    // Prevent drag if text is selected within the bubble
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0 && e.target.closest('.bubble')) {
      // console.log("Text selection detected, preventing drag start.");
      return;
    }
    // Check if click is directly on the bubble element or a direct child that shouldn't be ignored
    if (!e.target.closest('.bubble')) return; // Ensure click is inside a bubble

    startDragging(e.target.closest('.bubble'), e.clientX, e.clientY);
    if (isDragging) {
      e.preventDefault(); // Prevent default behavior like image drag
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
  }

  function onTouchStart(e) {
    if (e.touches.length > 1) return; // Ignore multi-touch
    const targetBubble = e.target.closest('.bubble');
    if (targetBubble) {
      e.preventDefault(); // Prevent scrolling
      const touch = e.touches[0];
      startDragging(targetBubble, touch.clientX, touch.clientY);
      if (isDragging) {
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('touchcancel', onTouchEnd);
      }
    }
  }

  function startDragging(bubbleElement, clientX, clientY) {
    if (!bubbleElement || isDragging) return; // Only drag one bubble at a time
    draggedBubble = bubbleData.find(b => b.element === bubbleElement);
    if (!draggedBubble) return;

    isDragging = true;
    draggedBubble.isDragging = true;
    draggedBubble.prevDx = draggedBubble.dx; // Store velocity before stopping
    draggedBubble.prevDy = draggedBubble.dy;
    draggedBubble.dx = 0; // Stop motion
    draggedBubble.dy = 0;

    // Get offset relative to the bubble's top-left corner
    const rect = draggedBubble.element.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;

    // Update container bounds in case of scroll/resize before drag
    containerRect = container.getBoundingClientRect();

    // Visual feedback
    draggedBubble.element.style.zIndex = 1000; // Bring to front
    draggedBubble.element.style.cursor = 'grabbing';
    container.style.cursor = 'grabbing'; // Change cursor on container too
    // Hide blur effect while dragging
    if (draggedBubble.blurElement) { draggedBubble.blurElement.style.opacity = '0'; }
  }

  function onMouseMove(e) {
    if (!isDragging || !draggedBubble) return;
    moveBubble(e.clientX, e.clientY);
  }

  function onTouchMove(e) {
    if (!isDragging || !draggedBubble) return;
    e.preventDefault(); // Prevent scrolling while moving bubble
    const touch = e.touches[0];
    moveBubble(touch.clientX, touch.clientY);
  }

  function moveBubble(clientX, clientY) {
    // Calculate new position relative to the container
    // clientX/Y are relative to viewport
    // containerRect.left/top is container's position relative to viewport
    let newX_container = (clientX - offsetX) - containerRect.left;
    let newY_container = (clientY - offsetY) - containerRect.top;

    // Clamp new position within container bounds using current bubble dimensions
    newX_container = Math.max(0, Math.min(newX_container, containerWidth - draggedBubble.width));
    newY_container = Math.max(0, Math.min(newY_container, containerHeight - draggedBubble.height));

    // Update bubble's internal position data
    draggedBubble.x = newX_container;
    draggedBubble.y = newY_container;

    // Apply position using transform
    draggedBubble.element.style.transform = `translate(${newX_container}px, ${newY_container}px)`;
  }

  function onMouseUp(e) {
    if (isDragging) stopDragging();
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  function onTouchEnd(e) {
    if (isDragging) stopDragging();
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchcancel', onTouchEnd);
  }

  function stopDragging() {
    if (!draggedBubble) return;

    // Restore visual state
    draggedBubble.element.style.zIndex = ''; // Reset z-index
    draggedBubble.element.style.cursor = 'grab';
    container.style.cursor = 'default';

    // Give the bubble a new, gentle velocity based on its last movement or random
    // A simple approach: give it a small random push
    const angle = Math.random() * Math.PI * 2;
    const speedFactor = parseFloat(draggedBubble.element.dataset.speedFactor) || 1.0;
    const minReleaseSpeed = 0.2; // Minimum speed after release
    const maxReleaseSpeed = 0.6; // Maximum speed after release
    const speed = (Math.random() * (maxReleaseSpeed - minReleaseSpeed) + minReleaseSpeed) * speedFactor; // Random speed within a range

    draggedBubble.dx = Math.cos(angle) * speed;
    draggedBubble.dy = Math.sin(angle) * speed;

    // Reset prevDx/y to reflect the new direction immediately for blur
    draggedBubble.prevDx = draggedBubble.dx;
    draggedBubble.prevDy = draggedBubble.dy;


    draggedBubble.isDragging = false; // Mark as no longer dragging
    draggedBubble = null; // Clear the dragged bubble reference
    isDragging = false; // Reset global dragging flag
  }


  // --- Animation function ---
  let animationFrameId = null; // To control the animation loop

  function animate() {
    // 1. Update positions & handle boundary collisions
    bubbleData.forEach(data => {
      if (data.isDragging) return; // Skip if being dragged

      // Store current velocity before updating position
      data.prevDx = data.dx;
      data.prevDy = data.dy;

      data.x += data.dx;
      data.y += data.dy;

      // Boundary collision detection (bounce) - Use current bubble dimensions
      if (data.x < 0) {
        data.x = 0; data.dx *= -1;
      } else if (data.x + data.width > containerWidth) {
        data.x = containerWidth - data.width; data.dx *= -1;
      }
      if (data.y < 0) {
        data.y = 0; data.dy *= -1;
      } else if (data.y + data.height > containerHeight) {
        data.y = containerHeight - data.height; data.dy *= -1;
      }
    });

    // 2. Handle bubble-to-bubble collisions (Simple approach)
    for (let i = 0; i < bubbleData.length; i++) {
      const bubbleA = bubbleData[i];
      if (bubbleA.isDragging || bubbleA.width === 0 || bubbleA.height === 0) continue; // Skip if dragging or invalid dimensions

      for (let j = i + 1; j < bubbleData.length; j++) {
        const bubbleB = bubbleData[j];
        if (bubbleB.isDragging || bubbleB.width === 0 || bubbleB.height === 0) continue; // Skip if dragging or invalid dimensions

        // Calculate distance between centers
        const centerAx = bubbleA.x + bubbleA.width / 2;
        const centerAy = bubbleA.y + bubbleA.height / 2;
        const centerBx = bubbleB.x + bubbleB.width / 2;
        const centerBy = bubbleB.y + bubbleB.height / 2;
        const dx = centerAx - centerBx;
        const dy = centerAy - centerBy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Use sum of average radius for simple collision check
        const radiusA = Math.max(bubbleA.width, bubbleA.height) / 2;
        const radiusB = Math.max(bubbleB.width, bubbleB.height) / 2;
        const minDistance = radiusA + radiusB;


        if (distance < minDistance && distance > 0) {
          // Collision occurred. Separate bubbles and swap velocities.

          const overlap = minDistance - distance;
          // Calculate separation vector
          const separationX = (dx / distance) * (overlap / 2 + 0.1); // Add tiny buffer to prevent sticking
          const separationY = (dy / distance) * (overlap / 2 + 0.1);

          // Apply separation, ensuring bounds are respected with current bubble sizes
          bubbleA.x = Math.max(0, Math.min(bubbleA.x + separationX, containerWidth - bubbleA.width));
          bubbleA.y = Math.max(0, Math.min(bubbleA.y + separationY, containerHeight - bubbleA.height));
          bubbleB.x = Math.max(0, Math.min(bubbleB.x - separationX, containerWidth - bubbleB.width));
          bubbleB.y = Math.max(0, Math.min(bubbleB.y - separationY, containerHeight - bubbleB.height));

          // Store velocities before swapping
          const tempDxA = bubbleA.dx;
          const tempDyA = bubbleA.dy;

          // Swap velocities (simple elastic collision approximation)
          bubbleA.dx = bubbleB.dx;
          bubbleA.dy = bubbleB.dy;
          bubbleB.dx = tempDxA;
          bubbleB.dy = tempDyA;

          // Update prevDx/y immediately after collision for correct blur direction
          bubbleA.prevDx = bubbleA.dx;
          bubbleA.prevDy = bubbleA.dy;
          bubbleB.prevDx = bubbleB.dx;
          bubbleB.prevDy = bubbleB.dy;
        }
      }
    }

    // 3. Apply final positions & Update Motion Blur
    bubbleData.forEach(data => {
      if (!data.isDragging) {
        // Apply position using transform
        data.element.style.transform = `translate(${data.x}px, ${data.y}px)`;

        // Motion Blur Logic
        if (data.blurElement) {
          // Use prevDx/prevDy to get velocity *before* this frame's position update
          const speed = Math.sqrt(data.prevDx * data.prevDx + data.prevDy * data.prevDy);

          if (speed > BLUR_SPEED_THRESHOLD) {
            // Calculate angle of motion (in radians)
            const angleRad = Math.atan2(data.prevDy, data.prevDx);
            // Calculate blur distance based on speed
            const blurDist = BLUR_DISTANCE_FACTOR * Math.min(2, speed / BLUR_SPEED_THRESHOLD); // Limit max blur distance

            // Calculate blur element position relative to bubble center
            // Blur trails *behind* the direction of motion, so add PI to angle
            const blurOffsetX = Math.cos(angleRad + Math.PI) * blurDist;
            const blurOffsetY = Math.sin(angleRad + Math.PI) * blurDist;

            // Apply blur transform relative to bubble's center (translate(-50%, -50%))
            data.blurElement.style.transform = `translate(${blurOffsetX}px, ${blurOffsetY}px)`;

            // Calculate opacity based on speed
            data.blurElement.style.opacity = Math.min(BLUR_MAX_OPACITY, (speed - BLUR_SPEED_THRESHOLD) * 0.8); // Scale opacity

          } else {
            // Hide blur if speed is below threshold
            data.blurElement.style.opacity = '0';
          }
        }
      }
    });

    animationFrameId = requestAnimationFrame(animate); // Continue loop
  }

  // --- Resize Handler ---
  let resizeTimeout;
  function handleResize() {
    // Debounce resize event for performance
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      console.log("Handling resize...");
      // Recalculate container dimensions and rectangle
      containerWidth = container.offsetWidth;
      containerHeight = container.offsetHeight;
      containerRect = container.getBoundingClientRect();
      console.log("Resized. New container dims:", containerWidth, containerHeight);

      // === Update bubble dimensions and data & clamp positions ===
      bubbleData.forEach(data => {
        // Re-read dimensions from the DOM element (affected by CSS media query)
        const bubbleRect = data.element.getBoundingClientRect();
        const newWidth = bubbleRect.width;
        const newHeight = bubbleRect.height;
        const newRadius = Math.max(newWidth, newHeight) / 2;

        // Update stored data if dimensions actually changed
        if (data.width !== newWidth || data.height !== newHeight) {
          console.log(`Updating bubble dimensions: ${data.width}x${data.height} -> ${newWidth}x${newHeight}`);
          data.width = newWidth;
          data.height = newHeight;
          data.radius = newRadius;
        }

        // Clamp positions immediately if outside new bounds, using updated dimensions
        data.x = Math.max(0, Math.min(data.x, containerWidth - data.width));
        data.y = Math.max(0, Math.min(data.y, containerHeight - data.height));

        // Re-apply transform ONLY if not dragging
        if (!data.isDragging) {
          data.element.style.transform = `translate(${data.x}px, ${data.y}px)`;
        }
        // Also reset blur transform/opacity on resize to avoid visual glitches
        if (data.blurElement) {
          data.blurElement.style.transform = 'translate(-50%, -50%)'; // Reset to center
          data.blurElement.style.opacity = '0'; // Hide blur
        }
      });

      // Restart animation loop if it wasn't running (shouldn't happen with AOS)
      if (!animationFrameId) {
        animate();
      }

    }, 250); // Adjust debounce delay (ms) as needed
  }

  // Listen for window resize events
  window.addEventListener('resize', handleResize);

  // --- Start ---
  // Initialize bubbles after the DOM is fully loaded and AOS has potentially laid out elements
  // Using a slight timeout can sometimes help ensure elements have correct dimensions
  // Or initialize within an AOS 'init' or 'load' event listener if available
  // For simplicity, use a small timeout after DOMContentLoaded
  setTimeout(initializeBubbles, 100);


  // Start the main animation loop
  console.log("Starting animation loop...");
  animate();

});

// --- Countdown Timer ---
document.addEventListener("DOMContentLoaded", function () {
    const eventDate = new Date("May 11, 2025 19:00:00").getTime();
    const countdownItems = document.querySelectorAll(".countdown-item");

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = eventDate - now;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            countdownItems.forEach((item) => {
                item.querySelector(".countdown-front").textContent = "0";
                item.querySelector(".countdown-back").textContent = "0";
            });
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const timeValues = [days, hours, minutes, seconds];

        countdownItems.forEach((item, index) => {
            const front = item.querySelector(".countdown-front");
            const back = item.querySelector(".countdown-back");

            if (front.textContent !== timeValues[index].toString()) {
                back.textContent = timeValues[index];
                item.querySelector(".countdown-flip").classList.add("flip");

                setTimeout(() => {
                    front.textContent = timeValues[index];
                    item.querySelector(".countdown-flip").classList.remove("flip");
                }, 600); // Match the duration of the flip animation
            }
        });
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call to display the countdown immediately
});