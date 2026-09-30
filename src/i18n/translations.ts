export interface TranslationKeys {
  dealershipName: string;
  shopBadge: string;
  location: string;
  selectLanguage: string;
  selectLanguageDesc: string;
  continueBtn: string;
  kurdish: string;
  english: string;
  arabic: string;
  allTrucks: string;
  inventoryTitle: string;
  inventorySubtitle: string;
  searchPlaceholder: string;
  filterByMake: string;
  filterByModel: string;
  filterByYear: string;
  filterByMileage: string;
  filterByPrice: string;
  filterByCondition: string;
  filterByStatus: string;
  allMakes: string;
  allModels: string;
  allConditions: string;
  allStatuses: string;
  resetFilters: string;
  showingResults: string;
  noTrucksFound: string;
  noTrucksDesc: string;
  available: string;
  reserved: string;
  sold: string;
  price: string;
  year: string;
  mileage: string;
  km: string;
  transmission: string;
  fuelType: string;
  axle: string;
  horsepower: string;
  hp: string;
  plateNumber: string;
  condition: string;
  color: string;
  viewDetails: string;
  callNow: string;
  whatsappChat: string;
  openGoogleMaps: string;
  contactUs: string;
  addressLabel: string;
  phoneNumbers: string;
  adminLogin: string;
  adminDashboard: string;
  signOut: string;
  fullPermission: string;
  adminRoleBadge: string;
  addTruckListing: string;
  editTruck: string;
  deleteTruck: string;
  confirmDeleteTitle: string;
  confirmDeleteDesc: string;
  cancel: string;
  delete: string;
  saveChanges: string;
  publishListing: string;
  managePermissions: string;
  authorizedPlatesAndAdmins: string;
  email: string;
  role: string;
  plateAccessNote: string;
  addAdmin: string;
  revokeAccess: string;
  superAdmin: string;
  admin: string;
  manager: string;
  galleryImages: string;
  addImageUrl: string;
  coverImage: string;
  specifications: string;
  overview: string;
  share: string;
  linkCopied: string;
  dealershipAddress: string;
  dealershipHours: string;
  dealershipHoursVal: string;
  priceInDollars: string;
  seedSampleData: string;
  seedDataConfirm: string;
  seedingDone: string;
  loading: string;
  sortBy: string;
  newest: string;
  priceLowHigh: string;
  priceHighLow: string;
  mileageLowHigh: string;
  yearNewOld: string;
  onlyAdminsCanPost: string;
}

export const translations: Record<'ku' | 'en' | 'ar', TranslationKeys> = {
  ku: {
    dealershipName: 'مەدینە ترەکس',
    shopBadge: 'Madinashop',
    location: 'هەولێر، کوردستان',
    selectLanguage: 'زمانێک هەڵبژێرە',
    selectLanguageDesc: 'تکایە زمانی پەسەندکراوت دیاری بکە بۆ پیشاندانی پێشانگای بارهەڵگرەکان',
    continueBtn: 'دەستپێکردن بە کوردی',
    kurdish: 'کوردی',
    english: 'English',
    arabic: 'العربية',
    allTrucks: 'هەموو بارهەڵگرەکان',
    inventoryTitle: 'پێشانگای بارهەڵگرەکانی مەدینە',
    inventorySubtitle: 'باشترین بارهەڵگری بازرگانی و قورس لە هەولێر و کوردستان بە نرخی دۆلار',
    searchPlaceholder: 'گەڕان بەپێی ناوی بارهەڵگر، مۆدێل، یان ژمارەی تابلۆ...',
    filterByMake: 'کۆمپانیا / مارکە',
    filterByModel: 'مۆدێل',
    filterByYear: 'ساڵی دروستکردن',
    filterByMileage: 'ڕۆیشتوو (کیلۆمەتر)',
    filterByPrice: 'نرخ بە دۆلار ($)',
    filterByCondition: 'دۆخی بارهەڵگر',
    filterByStatus: 'دۆخی بەردەستبوون',
    allMakes: 'هەموو کۆمپانیاکان',
    allModels: 'هەموو مۆدێلەکان',
    allConditions: 'هەموو دۆخەکان',
    allStatuses: 'هەموو دۆخەکانی فرۆشتن',
    resetFilters: 'سڕینەوەی فلتەرەکان',
    showingResults: 'ئەنجامە دۆزراوەکان',
    noTrucksFound: 'هیچ بارهەڵگرێک نەدۆزرایەوە',
    noTrucksDesc: 'تکایە فلتەرەکان دەستکاری بکە یان بگەڕێوە بۆ بینینی هەموو بارهەڵگرەکان',
    available: 'بەردەستە بۆ فرۆشتن',
    reserved: 'گیراوە / لە مامەڵەدایە',
    sold: 'فرۆشراوە',
    price: 'نرخ',
    year: 'ساڵ',
    mileage: 'ڕۆیشتوو',
    km: 'کم',
    transmission: 'گێڕ',
    fuelType: 'جۆری سووتەمەنی',
    axle: 'ئەکسل (تەوەر)',
    horsepower: 'هێزی ئەسپ',
    hp: 'HP',
    plateNumber: 'ژمارەی تابلۆ / پلاک',
    condition: 'دۆخ',
    color: 'ڕەنگ',
    viewDetails: 'بینینی هەموو وردەکارییەکان',
    callNow: 'پەیوەندی بکە',
    whatsappChat: 'نامە بنێرە لە واتسئەپ',
    openGoogleMaps: 'شوێن لەسەر گووگڵ ماپ',
    contactUs: 'پەیوەندیمان پێوە بکەن',
    addressLabel: 'ناونیشانی پێشانگا',
    phoneNumbers: 'ژمارەی مۆبایل و پەیوەندی',
    adminLogin: 'چوونەژوورەوەی بەڕێوەبەر',
    adminDashboard: 'پانێڵی بەڕێوەبردن',
    signOut: 'دەرچوون',
    fullPermission: 'دەسەڵاتی تەواوی بەڕێوەبەر (سڕینەوە و زیادکردن)',
    adminRoleBadge: 'ڕۆڵی بەڕێوەبەر',
    addTruckListing: 'بارهەڵگری نوێ دابنێ',
    editTruck: 'دەستکاریکردنی بارهەڵگر',
    deleteTruck: 'سڕینەوەی بارهەڵگر',
    confirmDeleteTitle: 'دڵنیایت لە سڕینەوە؟',
    confirmDeleteDesc: 'ئەم بارهەڵگرە بە یەکجاری لە پێشانگای مەدینە دەسڕدرێتەوە و ناگەڕێتەوە.',
    cancel: 'پەشیمانبوونەوە',
    delete: 'سڕینەوە',
    saveChanges: 'پاشەکەوتکردنی گۆڕانکاری',
    publishListing: 'بڵاوکردنەوەی بارهەڵگر',
    managePermissions: 'بەڕێوەبردنی دەسەڵاتەکان و تابلۆکان',
    authorizedPlatesAndAdmins: 'بەڕێوەبەرە ڕێگەپێدراوەکان بۆ بەڕێوەبردن بە سەلامەتی',
    email: 'ئیمەیڵ',
    role: 'ڕۆڵ / دەسەڵات',
    plateAccessNote: 'دەسەڵاتی تابلۆ / تێبینی تایبەت',
    addAdmin: 'زیادکردنی بەڕێوەبەری نوێ',
    revokeAccess: 'لابردنی دەسەڵات',
    superAdmin: 'خاوەنی سەرەکی (Super Admin)',
    admin: 'بەڕێوەبەر (Admin)',
    manager: 'سەرپەرشتیار (Manager)',
    galleryImages: 'وێنەکانی گەلەری (دەتوانیت چەند وێنەیەک دابنێیت)',
    addImageUrl: 'زیادکردنی بەستەری وێنە',
    coverImage: 'وێنەی سەرەکی',
    specifications: 'تایبەتمەندییە تەکنیکییەکان',
    overview: 'ڕوونکردنەوە و زانیاری',
    share: 'هاوبەشکردن',
    linkCopied: 'بەستەر کۆپی کرا!',
    dealershipAddress: 'کوردستان، هەولێر - پێشانگای مەدینە ترەکس',
    dealershipHours: 'کاتەکانی کارکردن',
    dealershipHoursVal: 'شەممە تا پێنجشەممە: ٨:٠٠ بەیانی تا ٧:٠٠ ئێوارە',
    priceInDollars: 'نرخەکان بە دۆلاری ئەمریکی دانراون',
    seedSampleData: 'داگرتنی بارهەڵگری نموونەیی',
    seedDataConfirm: 'ئایا دەتەوێت چەند بارهەڵگرێکی نموونەیی دابنێیت لە داتابەیس؟',
    seedingDone: 'بارهەڵگرە نموونەییەکان بە سەرکەوتوویی زیادکران',
    loading: 'بارکردن...',
    sortBy: 'ڕیزکردن بەپێی',
    newest: 'نوێترین بارهەڵگر',
    priceLowHigh: 'نرخ: لە کەمەوە بۆ زۆر',
    priceHighLow: 'نرخ: لە زۆرەوە بۆ کەم',
    mileageLowHigh: 'ڕۆیشتوو: کەمترین کیلۆمەتر',
    yearNewOld: 'مۆدێل: نوێترین ساڵ',
    onlyAdminsCanPost: 'تەنها بەڕێوەبەری سەرەکی مەدینە مافی دانان و دەستکاریکردنی بارهەڵگری هەیە.',
  },
  en: {
    dealershipName: 'Madina Trucks',
    shopBadge: 'Madinashop',
    location: 'Erbil, Kurdistan',
    selectLanguage: 'Select Your Language',
    selectLanguageDesc: 'Welcome to Madina Trucks dealership. Please choose your preferred language to continue.',
    continueBtn: 'Continue in English',
    kurdish: 'کوردی',
    english: 'English',
    arabic: 'العربية',
    allTrucks: 'All Trucks',
    inventoryTitle: 'Madina Truck Showroom',
    inventorySubtitle: 'High quality commercial and heavy-duty trucks in Erbil, Kurdistan. Clear pricing in USD ($).',
    searchPlaceholder: 'Search by truck name, model, plate number...',
    filterByMake: 'Make / Brand',
    filterByModel: 'Model',
    filterByYear: 'Year of Manufacture',
    filterByMileage: 'Mileage (Kilometers)',
    filterByPrice: 'Price Range (USD $)',
    filterByCondition: 'Condition',
    filterByStatus: 'Listing Status',
    allMakes: 'All Brands',
    allModels: 'All Models',
    allConditions: 'All Conditions',
    allStatuses: 'All Statuses',
    resetFilters: 'Reset Filters',
    showingResults: 'Results Found',
    noTrucksFound: 'No trucks match your criteria',
    noTrucksDesc: 'Try adjusting your filters or search keywords to find available trucks.',
    available: 'Available for Sale',
    reserved: 'Reserved',
    sold: 'Sold',
    price: 'Price',
    year: 'Year',
    mileage: 'Mileage',
    km: 'km',
    transmission: 'Transmission',
    fuelType: 'Fuel Type',
    axle: 'Axle Configuration',
    horsepower: 'Horsepower',
    hp: 'HP',
    plateNumber: 'Plate Number / VIN',
    condition: 'Condition',
    color: 'Color',
    viewDetails: 'View Full Specifications',
    callNow: 'Call Now',
    whatsappChat: 'WhatsApp Inquiry',
    openGoogleMaps: 'Open in Google Maps',
    contactUs: 'Contact Showroom',
    addressLabel: 'Showroom Location',
    phoneNumbers: 'Direct Phone Lines',
    adminLogin: 'Admin Sign In',
    adminDashboard: 'Admin Inventory Dashboard',
    signOut: 'Sign Out',
    fullPermission: 'Full Permission (Add, Edit, Remove Listings & Manage Roles)',
    adminRoleBadge: 'Admin Role',
    addTruckListing: 'Post New Truck for Sale',
    editTruck: 'Edit Truck Listing',
    deleteTruck: 'Remove Truck Listing',
    confirmDeleteTitle: 'Remove Truck Listing?',
    confirmDeleteDesc: 'This action is irreversible. The truck will be removed permanently from the public inventory.',
    cancel: 'Cancel',
    delete: 'Delete Truck',
    saveChanges: 'Save Changes',
    publishListing: 'Publish Truck to Showroom',
    managePermissions: 'Plates & Access Permissions',
    authorizedPlatesAndAdmins: 'Authorized Administrators to manage listings securely',
    email: 'Email Address',
    role: 'Role / Access Tier',
    plateAccessNote: 'Plate / Full Permission Notes',
    addAdmin: 'Grant Admin Access',
    revokeAccess: 'Revoke Access',
    superAdmin: 'Super Admin / Owner',
    admin: 'Listing Admin',
    manager: 'Showroom Manager',
    galleryImages: 'Multi-Image Gallery (Supports multiple high-res photos)',
    addImageUrl: 'Add Image URL',
    coverImage: 'Cover Photo',
    specifications: 'Technical Specifications',
    overview: 'Vehicle Overview & Notes',
    share: 'Share Truck',
    linkCopied: 'Link copied to clipboard!',
    dealershipAddress: 'Kurdistan, Erbil - Madina Trucks Showroom',
    dealershipHours: 'Business Hours',
    dealershipHoursVal: 'Saturday to Thursday: 8:00 AM – 7:00 PM',
    priceInDollars: 'All prices are in US Dollars ($ USD)',
    seedSampleData: 'Load Sample Inventory',
    seedDataConfirm: 'Populate the showroom with 6 high-detail heavy trucks?',
    seedingDone: 'Sample trucks loaded into database successfully!',
    loading: 'Loading showroom...',
    sortBy: 'Sort By',
    newest: 'Newest Arrivals',
    priceLowHigh: 'Price: Low to High',
    priceHighLow: 'Price: High to Low',
    mileageLowHigh: 'Mileage: Lowest First',
    yearNewOld: 'Year: Newest Model',
    onlyAdminsCanPost: 'Only authorized Madina administrators can post, modify, or remove truck listings.',
  },
  ar: {
    dealershipName: 'شاحنات المدينة',
    shopBadge: 'Madinashop',
    location: 'أربيل، كردستان',
    selectLanguage: 'اختر لغة العرض',
    selectLanguageDesc: 'مرحباً بكم في معرض شاحنات المدينة. يرجى اختيار اللغة المناسبة لمتابعة التصفح.',
    continueBtn: 'المتابعة بالعربية',
    kurdish: 'کوردی',
    english: 'English',
    arabic: 'العربية',
    allTrucks: 'كافة الشاحنات',
    inventoryTitle: 'معرض شاحنات المدينة',
    inventorySubtitle: 'أفضل الشاحنات التجارية والثقيلة في أربيل وكردستان بأسعار واضحة بالدولار',
    searchPlaceholder: 'ابحث باسم الشاحنة، الموديل، أو رقم اللوحة...',
    filterByMake: 'الشركة المصنعة / الماركة',
    filterByModel: 'الموديل',
    filterByYear: 'سنة الصنع',
    filterByMileage: 'المسافة المقطوعة (كم)',
    filterByPrice: 'نطاق السعر بالدولار ($)',
    filterByCondition: 'حالة الشاحنة',
    filterByStatus: 'حالة التوفر',
    allMakes: 'كافة الماركات',
    allModels: 'كافة الموديلات',
    allConditions: 'كافة الحالات',
    allStatuses: 'كافة الحالات',
    resetFilters: 'إعادة ضبط التصفية',
    showingResults: 'النتائج المتوفرة',
    noTrucksFound: 'لم يتم العثور على شاحنات مطابقة',
    noTrucksDesc: 'يرجى تعديل خيارات البحث أو التصفية للاطلاع على الشاحنات المعروضة.',
    available: 'متوفر للبيع',
    reserved: 'محجوز',
    sold: 'تم البيع',
    price: 'السعر',
    year: 'سنة الصنع',
    mileage: 'المسافة',
    km: 'كم',
    transmission: 'ناقل الحركة (الجير)',
    fuelType: 'نوع الوقود',
    axle: 'توزيع المحاور (Axle)',
    horsepower: 'القوة الحصانية',
    hp: 'حصان',
    plateNumber: 'رقم اللوحة / رقم الهيكل',
    condition: 'الحالة',
    color: 'اللون',
    viewDetails: 'عرض كامل المواصفات',
    callNow: 'اتصل بنا',
    whatsappChat: 'محادثة عبر واتساب',
    openGoogleMaps: 'الموقع على خرائط جوجل',
    contactUs: 'تواصل مع المعرض',
    addressLabel: 'عنوان المعرض',
    phoneNumbers: 'أرقام الاتصال المباشرة',
    adminLogin: 'تسجيل دخول الإدارة',
    adminDashboard: 'لوحة تحكم المخزون والإدارة',
    signOut: 'تسجيل الخروج',
    fullPermission: 'صلاحية كاملة (إضافة، تعديل، حذف الشاحنات وإدارة الأدوار)',
    adminRoleBadge: 'رتبة الإدارة',
    addTruckListing: 'إضافة شاحنة جديدة للبيع',
    editTruck: 'تعديل بيانات الشاحنة',
    deleteTruck: 'حذف الشاحنة',
    confirmDeleteTitle: 'تأكيد حذف الشاحنة؟',
    confirmDeleteDesc: 'سيتم حذف هذه الشاحنة نهائياً من المعرض ولن يمكن التراجع عن هذا الإجراء.',
    cancel: 'إلغاء',
    delete: 'حذف الشاحنة',
    saveChanges: 'حفظ التعديلات',
    publishListing: 'نشر الشاحنة في المعرض',
    managePermissions: 'إدارة الصلاحيات واللوحات',
    authorizedPlatesAndAdmins: 'المدراء المخولون لإدارة العروض بأمان وحماية كاملة',
    email: 'البريد الإلكتروني',
    role: 'الدور / مستوى الصلاحية',
    plateAccessNote: 'صلاحية اللوحات / ملاحظة أمنية',
    addAdmin: 'منح صلاحية إدارة',
    revokeAccess: 'إلغاء الصلاحية',
    superAdmin: 'المالك الرئيسي (Super Admin)',
    admin: 'مدير إعلانات (Admin)',
    manager: 'مشرف المعرض (Manager)',
    galleryImages: 'معرض الصور المتعدد (يدعم عدة زوايا وصور عالية الجودة)',
    addImageUrl: 'إضافة رابط صورة',
    coverImage: 'الصورة الرئيسية',
    specifications: 'المواصفات الفنية',
    overview: 'نظرة عامة وشرح الشاحنة',
    share: 'مشاركة الشاحنة',
    linkCopied: 'تم نسخ الرابط بنجاح!',
    dealershipAddress: 'كردستان، أربيل - معرض شاحنات المدينة',
    dealershipHours: 'أوقات الدوام',
    dealershipHoursVal: 'من السبت إلى الخميس: ٨:٠٠ صباحاً – ٧:٠٠ مساءً',
    priceInDollars: 'كافة الأسعار محددة بالدولار الأمريكي ($ USD)',
    seedSampleData: 'تحميل عينات المخزون',
    seedDataConfirm: 'هل ترغب في إضافة شاحنات نموذجية مميزة إلى قاعدة البيانات؟',
    seedingDone: 'تمت إضافة الشاحنات النموذجية بنجاح!',
    loading: 'جاري تحميل المعرض...',
    sortBy: 'ترتيب حسب',
    newest: 'الأحدث وصولاً',
    priceLowHigh: 'السعر: من الأقل إلى الأعلى',
    priceHighLow: 'السعر: من الأعلى إلى الأقل',
    mileageLowHigh: 'المسافة: الأقل عداداً',
    yearNewOld: 'سنة الصنع: الأحدث',
    onlyAdminsCanPost: 'فقط إدارة شاحنات المدينة المعتمدة تمتلك صلاحية نشر وحذف وتعديل الشاحنات.',
  },
};
