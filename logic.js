document.addEventListener('DOMContentLoaded', function () {
    const stepsIOS = [
        { src: 'images/b1.webp', alt: 'Bước 1' },
        { src: 'images/b2.webp', alt: 'Bước 2' },
        { src: 'images/b3.webp', alt: 'Bước 3' },
        { src: 'images/b4.webp', alt: 'Bước 4' },
        { src: 'images/b5.webp', alt: 'Bước 5' },
        { src: 'images/b6.webp', alt: 'Bước 6' },
        { src: 'images/b7.webp', alt: 'Bước 7' },
        { src: 'images/b8.webp', alt: 'Bước 8' },
        { src: 'images/b9.webp', alt: 'Bước 9' },
    ];

    const stepsAndroid = [
        { src: 'images/b1-andr.webp', alt: 'Bước 1 Android' },
        { src: 'images/b2-andr.webp', alt: 'Bước 2 Android' },
        { src: 'images/b3-andr.webp', alt: 'Bước 3 Android' },
        { src: 'images/b4-andr.webp', alt: 'Bước 4 Android' },
        { src: 'images/b5-andr.webp', alt: 'Bước 5 Android' },
        { src: 'images/b6-andr.webp', alt: 'Bước 6 Android' },
        { src: 'images/b7-andr.webp', alt: 'Bước 7 Android' },
    ];

    function initSlider(sliderId, leftArrowId, rightArrowId, steps, mobileLeftArrowId = null, mobileRightArrowId = null) {
        let current = 0;

        const isMobileSlider = sliderId.includes('-mobile');

        function getItemsPerPage() {
            return window.innerWidth < 1024 ? 2 : 4;
        }

        function renderDesktop(slider, itemsPerPage) {
            const isMobileViewport = window.innerWidth < 1024;
            slider.innerHTML = '';

            for (let i = current; i < current + itemsPerPage && i < steps.length; i++) {
                const img = document.createElement('img');
                img.src = steps[i].src;
                img.alt = steps[i].alt;
                img.className = 'rounded-lg object-contain';
                img.style.width = '100%';
                if (isMobileViewport) {
                    // Tỉ lệ 160px / 430px = 0.372, dùng vw để responsive
                    const viewportWidth = window.innerWidth;
                    const maxWidth = Math.min(viewportWidth * 0.372, 160);
                    img.style.maxWidth = maxWidth + 'px';
                } else {
                    img.style.maxWidth = '255px';
                }
                img.style.flex = '1 1 0%';
                slider.appendChild(img);
            }
        }

        function buildMobileTrack(slider) {
            let track = slider.querySelector('.slider-track');
            if (track) return track;

            track = document.createElement('div');
            track.className = 'slider-track';

            for (let i = 0; i < steps.length; i += 2) {
                const pairWrapper = document.createElement('div');
                pairWrapper.style.display = 'flex';
                pairWrapper.style.width = '100%';
                pairWrapper.style.flexShrink = '0';
                pairWrapper.style.gap = '15px';
                pairWrapper.style.alignItems = 'flex-start';
                pairWrapper.style.justifyContent = 'center';

                const createItem = (step, isFullWidth = false) => {
                    const item = document.createElement('div');
                    item.style.flex = isFullWidth ? '0 0 100%' : '0 0 auto';
                    item.style.width = isFullWidth ? '100%' : 'auto';
                    item.style.display = 'flex';
                    item.style.justifyContent = 'center';

                    const img = document.createElement('img');
                    img.src = step.src;
                    img.alt = step.alt;
                    img.className = 'rounded-lg object-contain';
                    img.style.width = 'auto';
                    // Tỉ lệ 160px / 430px = 0.372, responsive theo viewport
                    const viewportWidth = window.innerWidth;
                    const maxWidth = Math.min(viewportWidth * 0.372, 160);
                    img.style.maxWidth = maxWidth + 'px';
                    img.style.maxHeight = '456px';
                    img.style.display = 'block';
                    img.style.objectFit = 'contain';

                    item.appendChild(img);
                    return item;
                };

                const isLastSingle = i + 1 >= steps.length;
                pairWrapper.appendChild(createItem(steps[i], isLastSingle));

                if (!isLastSingle) {
                    pairWrapper.appendChild(createItem(steps[i + 1]));
                }

                track.appendChild(pairWrapper);
            }

            slider.style.overflow = 'hidden';
            slider.style.width = '100%';
            slider.style.position = 'relative';

            const pairCount = Math.ceil(steps.length / 2);
            track.style.width = pairCount * 100 + '%';

            slider.innerHTML = '';
            slider.appendChild(track);

            return track;
        }

        function updateSlider() {
            const slider = document.getElementById(sliderId);
            if (!slider) return;

            if (isMobileSlider) {
                const track = buildMobileTrack(slider);
                const pairIndex = Math.floor(current / 2);
                const translateX = -(pairIndex * 100);
                track.style.transform = 'translateX(' + translateX + '%)';
            } else {
                renderDesktop(slider, getItemsPerPage());
            }
        }

        function handleArrowClick(direction) {
            const itemsPerPage = getItemsPerPage();
            if (direction === 'left' && current > 0) {
                current--;
                updateSlider();
            } else if (direction === 'right' && current < steps.length - itemsPerPage) {
                current++;
                updateSlider();
            }
        }

        function handleMobileSwipe(direction) {
            if (!isMobileSlider) {
                handleArrowClick(direction);
                return;
            }

            const maxPairIndex = Math.floor((steps.length - 1) / 2);
            const maxCurrent = maxPairIndex * 2;

            if (direction === 'left' && current >= 2) {
                current -= 2;
            } else if (direction === 'right' && current + 2 <= maxCurrent) {
                current += 2;
            } else if (direction === 'right' && current < maxCurrent) {
                current = maxCurrent;
            } else if (direction === 'left' && current > 0) {
                current = 0;
            } else {
                return;
            }

            updateSlider();
        }

        const leftArrow = leftArrowId && document.getElementById(leftArrowId);
        const rightArrow = rightArrowId && document.getElementById(rightArrowId);

        if (leftArrow) {
            leftArrow.addEventListener('click', function () {
                handleArrowClick('left');
            });
        }

        if (rightArrow) {
            rightArrow.addEventListener('click', function () {
                handleArrowClick('right');
            });
        }

        if (mobileLeftArrowId) {
            const mobileLeftArrow = document.getElementById(mobileLeftArrowId);
            if (mobileLeftArrow) {
                mobileLeftArrow.addEventListener('click', function () {
                    handleArrowClick('left');
                });
            }
        }

        if (mobileRightArrowId) {
            const mobileRightArrow = document.getElementById(mobileRightArrowId);
            if (mobileRightArrow) {
                mobileRightArrow.addEventListener('click', function () {
                    handleArrowClick('right');
                });
            }
        }

        if (isMobileSlider) {
            let touchStartX = 0;
            let touchStartY = 0;
            let touchEndX = 0;
            let touchEndY = 0;
            var minSwipeDistance = 50;

            function attachSwipeEvents() {
                var sliderElement = document.getElementById(sliderId);
                if (!sliderElement || sliderElement.hasAttribute('data-swipe-attached')) return;

                sliderElement.setAttribute('data-swipe-attached', 'true');

                sliderElement.addEventListener('touchstart', function (e) {
                    var touch = e.changedTouches[0];
                    touchStartX = touch.screenX;
                    touchStartY = touch.screenY;
                }, { passive: true });

                sliderElement.addEventListener('touchend', function (e) {
                    var touch = e.changedTouches[0];
                    touchEndX = touch.screenX;
                    touchEndY = touch.screenY;
                    handleSwipe();
                }, { passive: true });

                function handleSwipe() {
                    var swipeDistanceX = touchStartX - touchEndX;
                    var swipeDistanceY = touchStartY - touchEndY;

                    if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) && Math.abs(swipeDistanceX) > minSwipeDistance) {
                        if (swipeDistanceX > 0) {
                            handleMobileSwipe('right');
                        } else {
                            handleMobileSwipe('left');
                        }
                    }
                }
            }

            setTimeout(attachSwipeEvents, 500);
        }

        var resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                current = 0;
                updateSlider();
            }, 250);
        });

        updateSlider();
    }

    initSlider('steps-slider', 'left-arrow', 'right-arrow', stepsIOS, 'left-arrow-mobile', 'right-arrow-mobile');

    if (document.getElementById('steps-slider-mobile')) {
        initSlider('steps-slider-mobile', null, null, stepsIOS, 'left-arrow-mobile-ios', 'right-arrow-mobile-ios');
    }

    initSlider('steps-slider-2', 'left-arrow-2', 'right-arrow-2', stepsAndroid, 'left-arrow-2-mobile', 'right-arrow-2-mobile');

    if (document.getElementById('steps-slider-2-mobile')) {
        initSlider('steps-slider-2-mobile', null, null, stepsAndroid, 'left-arrow-mobile-android', 'right-arrow-mobile-android');
    }
});