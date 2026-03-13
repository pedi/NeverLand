var express = require("express");
var router = express.Router();
var Category = require("../../models/Category");
var SubCategory = require("../../models/SubCategory");

router.get("/", function (req, res, next) {
  Category.find()
    .populate({ path: "subcategories" })
    .exec(function (err, categories) {
      if (err) return next(err);
      res.render("admin_categories", { allCategories: categories });
    });
});

router.post("/add/", function (req, res, next) {
  var name = (req.body.name || "").trim();
  var displayName = (req.body.displayName || "").trim();
  if (!name) return res.status(400).json({ error: "Name is required" });

  var category = new Category();
  category.name = name;
  if (displayName) category.displayName = displayName;
  category.deleted = false;
  category.save(function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

router.post("/:id/update/", function (req, res, next) {
  var id = req.params.id;
  var update = {};
  if (req.body.name !== undefined) update.name = req.body.name.trim();
  if (req.body.displayName !== undefined)
    update.displayName = req.body.displayName.trim();

  Category.findByIdAndUpdate(id, { $set: update }, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

router.post("/:id/toggle-delete/", function (req, res, next) {
  Category.findById(req.params.id, function (err, category) {
    if (err || !category)
      return res.status(404).json({ error: "Category not found" });
    category.deleted = !category.deleted;
    category.save(function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, deleted: category.deleted });
    });
  });
});

router.post("/:id/subcategories/add/", function (req, res, next) {
  var name = (req.body.name || "").trim();
  if (!name) return res.status(400).json({ error: "Name is required" });

  var sub = new SubCategory();
  sub.name = name;
  sub.deleted = false;
  sub.save(function (err, savedSub) {
    if (err) return res.status(500).json({ error: err.message });
    Category.findByIdAndUpdate(
      req.params.id,
      { $push: { subcategories: savedSub._id } },
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, subcategory: savedSub });
      }
    );
  });
});

router.post(
  "/:id/subcategories/:subId/toggle-delete/",
  function (req, res, next) {
    SubCategory.findById(req.params.subId, function (err, sub) {
      if (err || !sub)
        return res.status(404).json({ error: "Subcategory not found" });
      sub.deleted = !sub.deleted;
      sub.save(function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, deleted: sub.deleted });
      });
    });
  }
);

router.post(
  "/:id/subcategories/:subId/rename/",
  function (req, res, next) {
    var name = (req.body.name || "").trim();
    if (!name) return res.status(400).json({ error: "Name is required" });
    SubCategory.findByIdAndUpdate(
      req.params.subId,
      { $set: { name: name } },
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      }
    );
  }
);

module.exports = router;
