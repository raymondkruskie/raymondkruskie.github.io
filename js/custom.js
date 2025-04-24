
  (function ($) {
  
  "use strict";

    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });
    
    // CUSTOM LINK
    $('.smoothscroll').click(function(){
      var el = $(this).attr('href');
      var elWrapped = $(el);
      var header_height = $('.navbar').height();
  
      scrollToDiv(elWrapped,header_height);
      return false;
  
      function scrollToDiv(element,navheight){
        var offset = element.offset();
        var offsetTop = offset.top;
        var totalScroll = offsetTop-navheight;
  
        $('body,html').animate({
        scrollTop: totalScroll
        }, 300);
      }
    });
  
  })(window.jQuery);

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bubble-container');
    const bubbles = document.querySelectorAll('.bubble');

    // --- Initial Checks ---
    if (!container) {
        console.error("Bubble container not found!");
        return;
    }
    if (bubbles.length === 0) {
        console.error("Bubbles not found!");
        return;
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

    const MAX_INIT_ATTEMPTS = 100; // Prevent infinite loop if bubbles can't fit
    const BLUR_SPEED_THRESHOLD = 1.5; // How fast to move before blur appears
    const BLUR_MAX_OPACITY = 0.6; // Max opacity of blur effect (neon adjusted)
    const BLUR_DISTANCE_FACTOR = 15; // How far behind the blur trails (adjusted)


    // --- Initialization ---
    function initializeBubbles() {
        console.log("Initializing bubbles...");
        bubbleData.length = 0; // Clear existing data if re-initializing

        // Update container dimensions first
        containerWidth = container.offsetWidth;
        containerHeight = container.offsetHeight;
        containerRect = container.getBoundingClientRect();

        bubbles.forEach((bubble, index) => {
            // Important: Get dimensions *after* potential CSS changes
            const bubbleWidth = bubble.offsetWidth;
            const bubbleHeight = bubble.offsetHeight;
            if (bubbleWidth === 0 || bubbleHeight === 0) {
                console.warn(`Bubble ${index} has zero dimensions. Check CSS.`);
                // Assign default/fallback dimensions? Or skip? Skipping for now.
                return;
            }

            const radius = (bubbleWidth + bubbleHeight) / 4;
            const speedFactor = parseFloat(bubble.dataset.speedFactor) || 1.0;
            const blurElement = bubble.querySelector('.blur-effect');

            let initialX, initialY, placementAttempts = 0, overlaps;

            // Initial placement logic (Retry to avoid overlap)
            do {
                overlaps = false;
                initialX = Math.random() * (containerWidth - bubbleWidth);
                initialY = Math.random() * (containerHeight - bubbleHeight);
                // Check against bubbles already added in *this* initialization run
                for (let i = 0; i < bubbleData.length; i++) {
                    const other = bubbleData[i];
                    // Check if other bubble also has valid dimensions before calculating distance
                    if (other.width > 0 && other.height > 0) {
                        const dx = (initialX + radius) - (other.x + other.radius);
                        const dy = (initialY + radius) - (other.y + other.radius);
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < radius + other.radius + 5) { // Add small buffer
                            overlaps = true; break;
                        }
                    }
                }
                placementAttempts++;
            } while (overlaps && placementAttempts < MAX_INIT_ATTEMPTS);

            if (placementAttempts >= MAX_INIT_ATTEMPTS) {
                console.warn(`Could not place bubble ${index} without overlap.`);
                initialX = Math.random() * (containerWidth - bubbleWidth);
                initialY = Math.random() * (containerHeight - bubbleHeight);
            }

            const angle = Math.random() * Math.PI * 2;
            const baseSpeed = 0.6; // Base speed
            const speed = baseSpeed * speedFactor;

            bubbleData.push({
                element: bubble, blurElement: blurElement,
                x: initialX, y: initialY,
                dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed,
                prevDx: 0, prevDy: 0,
                width: bubbleWidth, height: bubbleHeight, radius: radius, // Store initial dimensions
                isDragging: false
            });

            // Apply initial position
            bubble.style.transform = `translate(${initialX}px, ${initialY}px)`;
            bubble.style.opacity = '1'; // Ensure visible

            // Add drag listeners (only once per bubble)
            // Check if listener already exists to avoid duplicates if re-initializing (simple check)
             if (!bubble.hasAttribute('data-listeners-added')) {
                 bubble.addEventListener('mousedown', onMouseDown);
                 bubble.addEventListener('touchstart', onTouchStart, { passive: false });
                 bubble.setAttribute('data-listeners-added', 'true');
            }
        });
        console.log("Bubble initialization complete. Count:", bubbleData.length);
    }


    // --- Drag Handlers ---
    function onMouseDown(e) {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0 && e.target.closest('.bubble')) {
             console.log("Text selection detected, preventing drag start.");
            return;
        }
        startDragging(e.target.closest('.bubble'), e.clientX, e.clientY);
        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }
    }

    function onTouchStart(e) {
         if (e.touches.length > 1) return; // Ignore multi-touch
        const targetBubble = e.target.closest('.bubble');
        if (targetBubble) {
             e.preventDefault();
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
        if (!bubbleElement || isDragging) return;
        draggedBubble = bubbleData.find(b => b.element === bubbleElement);
        if (!draggedBubble) return;

        isDragging = true;
        draggedBubble.isDragging = true;
        draggedBubble.prevDx = draggedBubble.dx; draggedBubble.prevDy = draggedBubble.dy;
        draggedBubble.dx = 0; draggedBubble.dy = 0;

        const rect = draggedBubble.element.getBoundingClientRect();
        offsetX = clientX - rect.left; offsetY = clientY - rect.top;
        containerRect = container.getBoundingClientRect(); // Refresh container bounds

        draggedBubble.element.style.zIndex = 1000;
        draggedBubble.element.style.cursor = 'grabbing';
        container.style.cursor = 'grabbing';
        if (draggedBubble.blurElement) { draggedBubble.blurElement.style.opacity = '0'; }
    }

    function onMouseMove(e) {
        if (!isDragging || !draggedBubble) return;
        moveBubble(e.clientX, e.clientY);
    }

    function onTouchMove(e) {
        if (!isDragging || !draggedBubble) return;
        e.preventDefault();
        const touch = e.touches[0];
        moveBubble(touch.clientX, touch.clientY);
    }

     function moveBubble(clientX, clientY) {
        let newX_viewport = clientX - offsetX; let newY_viewport = clientY - offsetY;
        let newX = newX_viewport - containerRect.left; let newY = newY_viewport - containerRect.top;

        // Use current dimensions from bubbleData for constraint check
        newX = Math.max(0, Math.min(newX, containerWidth - draggedBubble.width));
        newY = Math.max(0, Math.min(newY, containerHeight - draggedBubble.height));

        draggedBubble.x = newX; draggedBubble.y = newY;
        draggedBubble.element.style.transform = `translate(${newX}px, ${newY}px)`;
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
        const wasDraggingBubble = draggedBubble;
        isDragging = false;
        wasDraggingBubble.isDragging = false;

        wasDraggingBubble.element.style.zIndex = '';
        wasDraggingBubble.element.style.cursor = 'grab';
        container.style.cursor = 'default';

        // Give it a new velocity
        const angle = Math.random() * Math.PI * 2;
        const speedFactor = parseFloat(wasDraggingBubble.element.dataset.speedFactor) || 1.0;
        const speed = (Math.random() * 0.6 + 0.3) * speedFactor;
        wasDraggingBubble.dx = Math.cos(angle) * speed;
        wasDraggingBubble.dy = Math.sin(angle) * speed;

        draggedBubble = null;
    }


    // --- Animation function ---
    let animationFrameId = null; // To control the animation loop

    function animate() {
        // 1. Update positions & handle boundary collisions
        bubbleData.forEach(data => {
            if (data.isDragging) return; // Skip if being dragged

            data.prevDx = data.dx; data.prevDy = data.dy;
            data.x += data.dx; data.y += data.dy;

            // Boundary collision detection (bounce)
            let bounced = false;
            if (data.x < 0) { data.x = 0; data.dx *= -1; bounced = true; }
            else if (data.x + data.width > containerWidth) { data.x = containerWidth - data.width; data.dx *= -1; bounced = true; }
            if (data.y < 0) { data.y = 0; data.dy *= -1; bounced = true; }
            else if (data.y + data.height > containerHeight) { data.y = containerHeight - data.height; data.dy *= -1; bounced = true; }

            // No sound call here anymore
        });

        // 2. Handle bubble-to-bubble collisions
        for (let i = 0; i < bubbleData.length; i++) {
            const bubbleA = bubbleData[i];
            if (bubbleA.isDragging || bubbleA.width === 0) continue; // Skip if dragging or invalid dimensions

            for (let j = i + 1; j < bubbleData.length; j++) {
                const bubbleB = bubbleData[j];
                if (bubbleB.isDragging || bubbleB.width === 0) continue; // Skip if dragging or invalid dimensions

                const centerAx = bubbleA.x + bubbleA.radius; const centerAy = bubbleA.y + bubbleA.radius;
                const centerBx = bubbleB.x + bubbleB.radius; const centerBy = bubbleB.y + bubbleB.radius;
                const dx = centerAx - centerBx; const dy = centerAy - centerBy;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = bubbleA.radius + bubbleB.radius;

                if (distance < minDistance && distance > 0) {
                    // No sound call here anymore

                    const overlap = minDistance - distance;
                    const separationX = (dx / distance) * (overlap / 2 + 0.1); // Add tiny buffer
                    const separationY = (dy / distance) * (overlap / 2 + 0.1);

                    // Apply separation, ensuring bounds are respected with potentially new bubble sizes
                    bubbleA.x = Math.max(0, Math.min(bubbleA.x + separationX, containerWidth - bubbleA.width));
                    bubbleA.y = Math.max(0, Math.min(bubbleA.y + separationY, containerHeight - bubbleA.height));
                    bubbleB.x = Math.max(0, Math.min(bubbleB.x - separationX, containerWidth - bubbleB.width));
                    bubbleB.y = Math.max(0, Math.min(bubbleB.y - separationY, containerHeight - bubbleB.height));

                    // Velocity swap
                    const tempDx = bubbleA.dx; const tempDy = bubbleA.dy;
                    bubbleA.dx = bubbleB.dx; bubbleA.dy = bubbleB.dy;
                    bubbleB.dx = tempDx; bubbleB.dy = tempDy;
                }
            }
        }

        // 3. Apply final positions & Update Motion Blur
        bubbleData.forEach(data => {
             if (!data.isDragging) {
                 data.element.style.transform = `translate(${data.x}px, ${data.y}px)`;
                 // Motion Blur Logic
                 if (data.blurElement) {
                     const speed = Math.sqrt(data.prevDx * data.prevDx + data.prevDy * data.prevDy);
                     if (speed > BLUR_SPEED_THRESHOLD) {
                         const angleRad = Math.atan2(data.prevDy, data.prevDx);
                         const angleDeg = angleRad * 180 / Math.PI; // Correct conversion
                         const blurDist = BLUR_DISTANCE_FACTOR * Math.min(1.5, speed / BLUR_SPEED_THRESHOLD);
                         const blurOffsetX = Math.cos(angleRad + Math.PI) * blurDist;
                         const blurOffsetY = Math.sin(angleRad + Math.PI) * blurDist;

                         data.blurElement.style.transform = `translate(${blurOffsetX}px, ${blurOffsetY}px) rotate(${angleDeg}deg)`;
                         data.blurElement.style.opacity = Math.min(BLUR_MAX_OPACITY, (speed - BLUR_SPEED_THRESHOLD) * 0.4);
                     } else {
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

            // === Update bubble dimensions and data ===
            bubbleData.forEach(data => {
                // Re-read dimensions from the DOM element (affected by CSS media query)
                const newWidth = data.element.offsetWidth;
                const newHeight = data.element.offsetHeight;
                const newRadius = (newWidth + newHeight) / 4;

                 // Update stored data if dimensions actually changed
                if (data.width !== newWidth || data.height !== newHeight) {
                     console.log(`Updating bubble ${bubbleData.indexOf(data)} dimensions: ${data.width}x${data.height} -> ${newWidth}x${newHeight}`);
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
            });
            // Ensure animation continues smoothly after resize adjustments
             if (!animationFrameId) { // Restart animation if it was somehow stopped
                 animate();
            }

        }, 250); // Adjust debounce delay (ms) as needed
    }

    window.addEventListener('resize', handleResize);

    // --- Start ---
    initializeBubbles(); // Initial setup
    bubbles.forEach(bubble => bubble.style.cursor = 'grab');
    console.log("Starting animation loop...");
    animate(); // Start the main animation loop

});
